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

        // 1a. Ensure total_score column exists (Self-healing migration)
        try {
            const tableInfo = await db.all(sql`PRAGMA table_info(scores)`);
            const hasTotalScore = tableInfo.some((col: any) => col.name === 'total_score');
            if (!hasTotalScore) {
                console.log("Adding missing total_score column to scores table...");
                await db.run(sql`ALTER TABLE scores ADD COLUMN total_score REAL DEFAULT 0`);
            }
        } catch (migError) {
            console.error("Migration check failed:", migError);
        }

        // 1. Fetch Streak Config
        let streakConfig = [
            { days: 3, points: 50 },
            { days: 7, points: 150 },
            { days: 14, points: 500 }
        ];

        try {
            const streakConfigSetting = await db.select()
                .from(systemSettings)
                .where(eq(systemSettings.key, "streak_config"))
                .get();

            if (streakConfigSetting) {
                console.log("Found streak config raw:", streakConfigSetting.value);
                const parsed = JSON.parse(streakConfigSetting.value);
                if (Array.isArray(parsed)) {
                    streakConfig = parsed;
                }
            }
        } catch (confError) {
            console.error("Failed to parse streak config, using defaults:", confError);
        }

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

            // Weighted Score Calculation:
            // 1. Monitoring (50%) - monitoringBase is 0-100
            // 2. Hafalan (15%) - scoreEntry.hafalan is 0-100
            // 3. Ujian Tulis (15%) - scoreEntry.ujianTulis is 0-100
            // 4. Qiyamullail (20%) - scoreEntry.qiyamullail is 0-100

            const hScore = (scoreEntry?.hafalan || 0) * 0.15;
            const uScore = (scoreEntry?.ujianTulis || 0) * 0.15;
            const qScore = (scoreEntry?.qiyamullail || 0) * 0.20;
            const mScore = monitoringBase * 0.50;

            const totalScore = Math.round(hScore + uScore + qScore + mScore + streakBonus);

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
                    updatedAt: new Date()
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
        // Log more details if it's a D1 error or similar
        if (error.message) console.error("Error message:", error.message);
        if (error.stack) console.error("Stack trace:", error.stack);

        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message
        }, { status: 500 });
    }
}
