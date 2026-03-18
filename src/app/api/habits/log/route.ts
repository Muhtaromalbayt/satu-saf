import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/session";
import { getDb } from "@/lib/server/db";
import { userAmalan } from "@/lib/server/db/schema";
import { eq, and, sql } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { aspect, deedName, status, day, evidenceUrl, reflection, capturedAt } = await req.json();

        if (!aspect || !deedName || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const db = getDb();

        // If 'day' is provided, we match by user+aspect+deed+day
        // Otherwise we fallback to today's date
        const today = new Date().toISOString().split('T')[0];

        const existing = await db.select()
            .from(userAmalan)
            .where(
                and(
                    eq(userAmalan.userId, user.id),
                    eq(userAmalan.aspect, aspect),
                    eq(userAmalan.deedName, deedName),
                    day
                        ? eq(userAmalan.day, day)
                        : sql`date(${userAmalan.timestamp}) = ${today}`
                )
            )
            .get();

        if (existing) {
            await db.update(userAmalan)
                .set({
                    status,
                    day: day || existing.day,
                    evidenceUrl: evidenceUrl !== undefined ? evidenceUrl : existing.evidenceUrl,
                    reflection: reflection !== undefined ? reflection : existing.reflection,
                    capturedAt: capturedAt !== undefined ? capturedAt : existing.capturedAt
                })
                .where(eq(userAmalan.id, existing.id));
            return NextResponse.json({ success: true, action: 'updated', id: existing.id });
        } else {
            const result = await db.insert(userAmalan).values({
                userId: user.id,
                aspect,
                deedName,
                status,
                day: day || null,
                evidenceUrl: evidenceUrl || null,
                reflection: reflection || null,
                capturedAt: capturedAt || null,
            }).returning({ id: userAmalan.id });
            return NextResponse.json({ success: true, action: 'inserted', id: result[0].id });
        }
    } catch (error) {
        console.error("Habit log error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const getAll = searchParams.get('all') === 'true';
        const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
        const dayParam = searchParams.get('day');
        const day = dayParam ? parseInt(dayParam) : null;

        const db = getDb();

        let logs: any[] = [];
        if (getAll) {
            logs = await db.select()
                .from(userAmalan)
                .where(eq(userAmalan.userId, user.id));
        } else {
            logs = await db.select()
                .from(userAmalan)
                .where(
                    and(
                        eq(userAmalan.userId, user.id),
                        day
                            ? eq(userAmalan.day, day)
                            : sql`date(${userAmalan.timestamp}) = ${date}`
                    )
                );
        }

        return NextResponse.json({ logs });
    } catch (error) {
        console.error("Habit fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
