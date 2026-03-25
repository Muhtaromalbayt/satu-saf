import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { user, scores, userAmalan, monitoringTasks } from "@/lib/server/db/schema";
import { eq, count, sql, and } from "drizzle-orm";
import { fetchParticipants } from "@/lib/server/sheets";

/**
 * GET /api/leaderboard
 * Returns a ranked list of all santri based on a weighted score.
 */
export async function GET(_req: NextRequest) {
    const db = getDb();

    // 1. Get Master List from Sheets (and local users)
    const participants = await fetchParticipants();

    // 2. Get all local scores for points mapping
    const allScores = await db.select().from(scores);
    const dbUserIds = new Set(allScores.map(s => s.userId));

    // 3. Filter santri: 
    // - Always show if they are in the Master List
    // - BUT exclude demo_santri
    const santriList = participants.filter(p => 
        p.role === "santri" && 
        p.id !== 'demo_santri'
    );

    if (santriList.length === 0) {
        return NextResponse.json({ leaderboard: [] });
    }

    // 4. Get current active tasks count
    const activeTasksCountResult = await db.select({ count: count() })
        .from(monitoringTasks)
        .where(eq(monitoringTasks.isActive, true))
        .get();

    const activeTasksCount = (activeTasksCountResult as any)?.count || 0;

    // Get monitoring done counts per user from userAmalan
    const monitoringCounts = await db
        .select({
            userId: userAmalan.userId,
            doneCount: count(),
        })
        .from(userAmalan)
        .where(eq(userAmalan.status, "verified"))
        .groupBy(userAmalan.userId);

    const scoresMap = Object.fromEntries(allScores.map(s => [s.userId, s]));
    const monitoringMap = Object.fromEntries(monitoringCounts.map(m => [m.userId, m.doneCount]));

    const TOTAL_MONITORING = 14 * activeTasksCount;

    const leaderboard = santriList.map(s => {
        const sc = scoresMap[s.id];
        const doneCount = monitoringMap[s.id] ?? 0;

        // Use pre-calculated totalScore if available (from Sync)
        // Fallback to 0 if sync hasn't been run yet
        const totalScore = Math.round(sc?.totalScore || 0);

        return {
            id: s.id,
            name: s.nama,
            kelompok: s.kelompok,
            totalScore,
            monitoringDone: doneCount,
            hafalanAvg: Math.round(sc?.hafalan || 0),
            tesTulis: sc?.ujianTulis || 0,
            tahajudCount: sc?.qiyamullail || 0,
        };
    });

    // Sort descending
    leaderboard.sort((a, b) => b.totalScore - a.totalScore);

    return NextResponse.json({ leaderboard });
}
