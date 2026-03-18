import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { scores } from "@/lib/server/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/server/session";

/**
 * GET /api/scores
 * Returns the current user's score record.
 */
export async function GET(_req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getDb();
    const result = await db.select().from(scores).where(eq(scores.userId, user.id)).limit(1);

    if (result.length === 0) {
        return NextResponse.json({ scores: null });
    }

    const s = result[0];
    return NextResponse.json({
        scores: {
            ...s,
            hafalanAvg: s.hafalanCount && s.hafalanCount > 0 ? (s.hafalanTotal ?? 0) / s.hafalanCount : 0,
        },
    });
}

/**
 * POST /api/scores
 * Body supports patching individual score fields:
 *   - { type: 'hafalan', nilai: number }       → adds to hafalan total+count
 *   - { type: 'tes_tulis', nilai: number }      → sets tes_tulis (0-100)
 *   - { type: 'tahajud' }                        → increments tahajud count
 */
export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null);
    if (!body?.type) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const db = getDb();

    // Fetch or create score row
    const existing = await db.select().from(scores).where(eq(scores.userId, user.id)).limit(1);
    let row = existing[0];

    if (!row) {
        await db.insert(scores).values({ userId: user.id });
        const created = await db.select().from(scores).where(eq(scores.userId, user.id)).limit(1);
        row = created[0];
    }

    if (body.type === "hafalan") {
        const nilai = Number(body.nilai);
        if (isNaN(nilai) || nilai < 0 || nilai > 100)
            return NextResponse.json({ error: "Nilai hafalan harus antara 0-100" }, { status: 400 });
        await db.update(scores).set({
            hafalanTotal: (row.hafalanTotal ?? 0) + nilai,
            hafalanCount: (row.hafalanCount ?? 0) + 1,
        }).where(eq(scores.userId, user.id));
    } else if (body.type === "tes_tulis") {
        const nilai = Number(body.nilai);
        if (isNaN(nilai) || nilai < 0 || nilai > 100)
            return NextResponse.json({ error: "Nilai tes tulis harus antara 0-100" }, { status: 400 });
        await db.update(scores).set({ tesTulis: nilai }).where(eq(scores.userId, user.id));
    } else if (body.type === "tahajud") {
        await db.update(scores).set({
            tahajudCount: (row.tahajudCount ?? 0) + 1,
        }).where(eq(scores.userId, user.id));
    } else {
        return NextResponse.json({ error: "Tipe tidak valid. Gunakan: hafalan, tes_tulis, tahajud" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
}
