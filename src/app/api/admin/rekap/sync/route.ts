import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { user as userTable, scores as scoresTable, userAmalan, systemSettings } from "@/lib/server/db/schema";
import { eq, and, sql, desc, inArray } from "drizzle-orm";
import { MONITORING_ASPECTS } from "@/lib/constants/monitoring";
import { getAdminSession } from "@/lib/admin";

export async function POST(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = getDb();

        // 1. Fetch Streak Config
        const streakConfigSetting = await db.select()
            .from(systemSettings)
            .where(eq(systemSettings.key, "streak_config"))
            .get();

        const streakConfig = streakConfigSetting
            ? JSON.parse(streakConfigSetting.value)
            : [
                { days: 3, points: 50 },
                { days: 7, points: 150 },
                { days: 14, points: 500 }
            ];

        // 2. Fetch all santri
        const santris = await db.select().from(userTable).where(eq(userTable.role, 'santri')).all();
        const scores = await db.select().from(scoresTable).all();

        // 3. Calculate Monitoring Scores & Streaks
        const totalTasksPerDay = MONITORING_ASPECTS.reduce((acc, aspect) => acc + (aspect.tasks?.length || 0), 0);
        const totalPossibleTasks = totalTasksPerDay * 14;

        // Fetch verified tasks for all users
        const allVerifiedLogs = await db.select({
            userId: userAmalan.userId,
            day: userAmalan.day
        })
            .from(userAmalan)
            .where(eq(userAmalan.status, 'verified'))
            .orderBy(userAmalan.userId, desc(userAmalan.day))
            .all();

        // Helper maps
        const verifiedCountMap = new Map<string, number>();
        const userLogsMap = new Map<string, number[]>();

        for (const log of allVerifiedLogs) {
            verifiedCountMap.set(log.userId, (verifiedCountMap.get(log.userId) || 0) + 1);
            if (!userLogsMap.has(log.userId)) userLogsMap.set(log.userId, []);
            if (log.day !== null) {
                const dayStr = log.day.toString();
                // Ensure unique days
                if (!userLogsMap.get(log.userId)!.includes(log.day)) {
                    userLogsMap.get(log.userId)!.push(log.day);
                }
            }
        }

        // 4. Update each user's total score
        const results = [];
        for (const s of santris) {
            const scoreEntry = scores.find(sc => sc.userId === s.id);
            const verifiedCount = verifiedCountMap.get(s.id) || 0;

            // Base Monitoring Score (percentage)
            const monitoringBase = totalPossibleTasks > 0
                ? (verifiedCount / totalPossibleTasks) * 100
                : 0;

            // Streak Calculation
            const days = userLogsMap.get(s.id) || [];
            // Sort descending to check from latest day
            days.sort((a, b) => b - a);

            let streak = 0;
            if (days.length > 0) {
                let expectedDay = days[0];
                for (const d of days) {
                    if (d === expectedDay) {
                        streak++;
                        expectedDay--;
                    } else break;
                }
            }

            // Streak Bonus Points
            let streakBonus = 0;
            // Find the highest applicable streak bonus
            // Sort config by days descending
            const sortedConfig = [...streakConfig].sort((a, b) => b.days - a.days);
            for (const conf of sortedConfig) {
                if (streak >= conf.days) {
                    streakBonus = conf.points;
                    break;
                }
            }

            const totalScore = (scoreEntry?.hafalan || 0) +
                (scoreEntry?.ujianTulis || 0) +
                (scoreEntry?.qiyamullail || 0) +
                monitoringBase +
                streakBonus;

            // Persistent update to DB
            if (scoreEntry) {
                await db.update(scoresTable)
                    .set({
                        monitoring: monitoringBase,
                        totalScore: totalScore,
                        updatedAt: new Date()
                    })
                    .where(eq(scoresTable.userId, s.id));
            } else {
                await db.insert(scoresTable).values({
                    userId: s.id,
                    monitoring: monitoringBase,
                    totalScore: totalScore,
                });
            }

            results.push({ userId: s.id, streak, bonus: streakBonus, total: totalScore });
        }

        return NextResponse.json({
            success: true,
            message: `Synced ${santris.length} users to leaderboard.`,
            results
        });

    } catch (error: any) {
        console.error("Sync error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
