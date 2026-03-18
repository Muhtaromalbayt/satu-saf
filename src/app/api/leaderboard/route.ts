import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { user, scores, userAmalan, monitoringTasks } from "@/lib/server/db/schema";
import { eq, count, sql, and } from "drizzle-orm";

/**
 * GET /api/leaderboard
 * Returns a ranked list of all santri based on a weighted score.
 */
export async function GET(_req: NextRequest) {
    const db = getDb();

    // Get all santri
    const santriList = await db
        .select()
        .from(user)
        .where(eq(user.role, "santri"));

    if (santriList.length === 0) {
        return NextResponse.json({ leaderboard: [] });
    }

    // Get current active tasks count
    const activeTasksCountResult = await db.select({ count: count() })
        .from(monitoringTasks)
        .where(eq(monitoringTasks.isActive, true))
        .get();

    const activeTasksCount = (activeTasksCountResult as any)?.count || 0;

    // Get all scores
    const allScores = await db.select().from(scores);

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

        // Weighted score calculation
        // 1. Monitoring 50%
        const monitoringScore = (doneCount / TOTAL_MONITORING) * 50;

        // 2. Hafalan 15% (Maksimal 100)
        const hafalanAvg = sc && sc.hafalanCount && sc.hafalanCount > 0
            ? (sc.hafalanTotal ?? 0) / sc.hafalanCount
            : 0;
        const hafalanScore = (hafalanAvg / 100) * 15;

        // 3. Tes Tulis 15% (Maksimal 100)
        const tesTulisScore = ((sc?.tesTulis ?? 0) / 100) * 15;

        // 4. Qiyamullail 20% (Maksimal 90)
        // Mapping 14 days of Tahajud to a score of 90
        const qiyamullailPoints = (Math.min(sc?.tahajudCount ?? 0, 14) / 14) * 90;
        const qiyamullailScore = (qiyamullailPoints / 90) * 20;

        const totalScore = Math.round(monitoringScore + hafalanScore + tesTulisScore + qiyamullailScore);

        return {
            id: s.id,
            name: s.name,
            kelompok: s.kelompok,
            totalScore,
            monitoringDone: doneCount,
            hafalanAvg: Math.round(hafalanAvg),
            tesTulis: sc?.tesTulis ?? 0,
            tahajudCount: sc?.tahajudCount ?? 0,
        };
    });

    // Sort descending
    leaderboard.sort((a, b) => b.totalScore - a.totalScore);

    return NextResponse.json({ leaderboard });
}
