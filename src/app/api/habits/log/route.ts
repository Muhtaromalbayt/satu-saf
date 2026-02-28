import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/lib/server/db";
import { userAmalan } from "@/lib/server/db/schema";
import { eq, and, sql } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { aspect, deedName, status, chapterId } = await req.json();

        if (!aspect || !deedName || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const db = getDb();

        // We might want to prevent duplicate logs for the same day/habit
        // But for simplicity, we'll just insert for now, or update if it exists for today
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const existing = await db.select()
            .from(userAmalan)
            .where(
                and(
                    eq(userAmalan.userId, session.user.id),
                    eq(userAmalan.aspect, aspect),
                    eq(userAmalan.deedName, deedName),
                    sql`date(${userAmalan.timestamp}) = ${today}`
                )
            )
            .get();

        if (existing) {
            await db.update(userAmalan)
                .set({
                    status,
                    chapterId: chapterId || null,
                    timestamp: sql`CURRENT_TIMESTAMP`,
                    verifiedByParent: false // Reset verification if updated
                })
                .where(eq(userAmalan.id, existing.id));

            return NextResponse.json({ success: true, action: 'updated', id: existing.id });
        } else {
            const result = await db.insert(userAmalan).values({
                userId: session.user.id,
                aspect,
                deedName,
                status,
                chapterId: chapterId || null,
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
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
        const targetUserId = searchParams.get('userId') || session.user.id;

        const db = getDb();
        const { user } = await import("@/lib/server/db/schema");

        // Security check: if targetUserId != current userId, must be the parent
        if (targetUserId !== session.user.id) {
            const targetUser = await db.select().from(user).where(eq(user.id, targetUserId)).get();
            if (!targetUser || targetUser.parentId !== session.user.id) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
        }

        const logs = await db.select()
            .from(userAmalan)
            .where(
                and(
                    eq(userAmalan.userId, targetUserId),
                    sql`date(${userAmalan.timestamp}) = ${date}`
                )
            );

        return NextResponse.json({ logs });
    } catch (error) {
        console.error("Habit fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
