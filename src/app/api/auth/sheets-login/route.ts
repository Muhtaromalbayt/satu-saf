import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { findParticipant, findParticipantByName, findMentorByKelompok } from "@/lib/server/sheets";
import { getDb } from "@/lib/server/db";
import { user, session } from "@/lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import { createSession, deleteUserSessions, SESSION_COOKIE } from "@/lib/server/session";

/**
 * POST /api/auth/sheets-login
 * Body: { nama?: string, kelompok?: string, password?: string, pin?: string, newPin?: string, role?: string }
 */
export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);

    // Kelompok is required for santri and mentor, but NOT for parent
    if (!body?.kelompok && body?.role !== 'parent') {
        return NextResponse.json({ error: "Kelompok wajib diisi." }, { status: 400 });
    }

    const db = getDb();
    let name = "";
    let role = "santri";
    let sheetRowId = null;
    let resolvedKelompok = body.kelompok || "";

    // 1. Resolve Identity
    const mentorPassword = `nf${body.kelompok}`;
    if (body.password === mentorPassword || body.password === "nurulfalah20") {
        // Mentor Mode
        name = `Mentor ${body.kelompok}`;
        role = "mentor";
    } else if (body.role === 'parent') {
        // Parent Mode (Wali) — name-only lookup
        if (!body.nama) {
            return NextResponse.json({ error: "Nama Ananda wajib diisi." }, { status: 400 });
        }
        // Try with kelompok first, then fallback to name-only
        let participant = body.kelompok
            ? await findParticipant(body.nama, body.kelompok)
            : await findParticipantByName(body.nama);
        if (!participant) {
            participant = await findParticipantByName(body.nama);
        }
        if (!participant) {
            return NextResponse.json({ error: "Nama Ananda tidak ditemukan." }, { status: 401 });
        }
        name = `Wali ${participant.nama}`;
        role = "parent";
        sheetRowId = participant.id;
        resolvedKelompok = participant.kelompok;
    } else {
        // Santri Mode
        if (!body.nama) {
            return NextResponse.json({ error: "Nama wajib diisi." }, { status: 400 });
        }
        const participant = await findParticipant(body.nama, body.kelompok);
        if (!participant) {
            return NextResponse.json({ error: "Nama atau Kelompok tidak ditemukan." }, { status: 401 });
        }
        name = participant.nama;
        role = participant.role || "santri";
        sheetRowId = participant.id;
    }

    // 2. Find or Create User in D1
    const existingUsers = await db
        .select()
        .from(user)
        .where(
            and(
                eq(user.name, name),
                eq(user.kelompok, resolvedKelompok)
            )
        )
        .limit(1);

    let currentUser = existingUsers[0];

    // 2.5 Security Check for Santri
    if (role === "santri") {
        if (currentUser?.pin) {
            // Case A: User has a PIN, verify it
            if (!body.pin) {
                return NextResponse.json({ error: "PIN_REQUIRED", message: "Masukkan PIN kamu." }, { status: 401 });
            }
            if (body.pin !== currentUser.pin) {
                return NextResponse.json({ error: "INVALID_PIN", message: "PIN yang kamu masukkan salah." }, { status: 401 });
            }
        } else {
            // Case B: User has NO PIN (New or transitioning), require setup
            if (!body.newPin) {
                return NextResponse.json({ error: "SETUP_PIN_REQUIRED", message: "Buat PIN 4-angka untuk keamanan akunmu." }, { status: 401 });
            }
            if (!/^\d{4}$/.test(body.newPin)) {
                return NextResponse.json({ error: "INVALID_FORMAT", message: "PIN harus berupa 4 angka." }, { status: 401 });
            }

            // If user exists but no PIN, update it
            if (currentUser) {
                await db.update(user).set({ pin: body.newPin }).where(eq(user.id, currentUser.id));
                currentUser.pin = body.newPin;
            }
        }
    }

    if (!currentUser) {
        const newId = crypto.randomUUID();
        await db.insert(user).values({
            id: newId,
            name: name,
            kelompok: resolvedKelompok,
            sheetRowId: sheetRowId,
            role: role,
            pin: role === "santri" ? body.newPin : null,
        });
        const created = await db.select().from(user).where(eq(user.id, newId)).limit(1);
        currentUser = created[0];
    }

    // 3. Prevent double-login: remove any existing sessions for this user
    await deleteUserSessions(currentUser.id);

    // 4. Create new session
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
    const userAgent = req.headers.get("user-agent") || "";
    const { token, expiresAt } = await createSession(currentUser.id, ipAddress, userAgent);

    const response = NextResponse.json({
        success: true,
        user: {
            id: currentUser.id,
            name: currentUser.name,
            kelompok: currentUser.kelompok,
            role: currentUser.role,
        },
    });

    response.cookies.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: expiresAt,
        path: "/",
    });

    return response;
}

/**
 * DELETE /api/auth/sheets-login
 * Logs out the current user
 */
export async function DELETE(req: NextRequest) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;

    if (token) {
        const db = getDb();
        await db.delete(session).where(eq(session.token, token));
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, "", { expires: new Date(0), path: "/" });
    return response;
}
