import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/session";
import { getDb } from "@/lib/server/db";
import { amalanReactions, userAmalan, user } from "@/lib/server/db/schema";
import { eq, and, desc, sql, inArray } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const targetUserId = searchParams.get('userId');
        const kelompok = searchParams.get('kelompok');

        const db = getDb();

        // 1. Fetch Recent Activities
        let query = db.select({
            id: userAmalan.id,
            userName: user.name,
            kelompok: user.kelompok,
            deedName: userAmalan.deedName,
            status: userAmalan.status,
            day: userAmalan.day,
            timestamp: userAmalan.timestamp,
            userId: userAmalan.userId,
            evidenceUrl: userAmalan.evidenceUrl,
        })
            .from(userAmalan)
            .innerJoin(user, eq(userAmalan.userId, user.id))
            .where(
                and(
                    sql`${userAmalan.status} IN ('pending', 'verified', 'done')`,
                    targetUserId ? eq(userAmalan.userId, targetUserId) : undefined,
                    kelompok ? eq(user.kelompok, kelompok) : undefined
                )
            )
            .orderBy(desc(userAmalan.timestamp))
            .limit(50);

        const rawLogs = await query;
        if (rawLogs.length === 0) return NextResponse.json({ feed: [] });

        const amalanIds = rawLogs.map(l => l.id);

        // 2. Fetch Reactions for these activities
        const allReactions = await db.select({
            id: amalanReactions.id,
            amalanId: amalanReactions.amalanId,
            type: amalanReactions.type,
            content: amalanReactions.content,
            userName: user.name,
        })
            .from(amalanReactions)
            .innerJoin(user, eq(amalanReactions.userId, user.id))
            .where(inArray(amalanReactions.amalanId, amalanIds));

        // 3. Fetch all verified logs for these users to calculate streaks efficiently
        const uniqueUserIds = [...new Set(rawLogs.map(l => l.userId))];
        const userLogs = await db.select({
            userId: userAmalan.userId,
            day: userAmalan.day
        })
            .from(userAmalan)
            .where(and(
                inArray(userAmalan.userId, uniqueUserIds),
                sql`${userAmalan.status} IN ('pending', 'verified', 'done')`
            ))
            .orderBy(userAmalan.userId, desc(userAmalan.day));

        const streaks: Record<string, number> = {};
        for (const uid of uniqueUserIds) {
            const days = [...new Set(
                userLogs.filter(l => l.userId === uid).map(l => l.day)
            )].filter(d => d !== null) as number[];

            let streak = 0;
            if (days.length > 0) {
                let expectedDay = days[0];
                for (const d of days) {
                    if (d === expectedDay) {
                        streak++;
                        expectedDay--;
                    } else {
                        break;
                    }
                }
            }
            streaks[uid] = streak;
        }

        // 4. Combine Everything
        const feed = rawLogs.map(log => ({
            ...log,
            message: `Masyaallah ananda ${log.userName} telah mendawamkan ${log.deedName}.`,
            streak: streaks[log.userId] || 0,
            reactions: allReactions.filter(r => r.amalanId === log.id),
        }));

        return NextResponse.json({ feed });

    } catch (error) {
        console.error("Feed error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
