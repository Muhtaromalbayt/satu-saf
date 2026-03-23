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
            
            const hasStreak = tableInfo.some((col: any) => col.name === 'streak_count');
            if (!hasStreak) {
                console.log("Adding streak columns to scores table...");
                await db.run(sql`ALTER TABLE scores ADD COLUMN streak_count INTEGER DEFAULT 0`);
                await db.run(sql`ALTER TABLE scores ADD COLUMN best_streak INTEGER DEFAULT 0`);
                await db.run(sql`ALTER TABLE scores ADD COLUMN last_streak_day INTEGER`);
            }
        } catch (migError) {
            console.error("Migration check failed:", migError);
        }

        // 1. Fetch Configs (Streak & Scoring Weight)
        let streakConfig = [
            { days: 3, points: 50 },
            { days: 7, points: 150 },
            { days: 14, points: 500 }
        ];
        let scoringWeight = {
            hafalan: 15,
            ujianTulis: 15,
            qiyamullail: 20,
            monitoring: 50
        };

        try {
            const settings = await db.select()
                .from(systemSettings)
                .where(inArray(systemSettings.key, ["streak_config", "scoring_weight"]))
                .all();

            const streakSet = settings.find(s => s.key === "streak_config");
            if (streakSet) {
                const parsed = JSON.parse(streakSet.value);
                if (Array.isArray(parsed)) streakConfig = parsed;
            }

            const weightSet = settings.find(s => s.key === "scoring_weight");
            if (weightSet) {
                scoringWeight = JSON.parse(weightSet.value);
            }
        } catch (confError) {
            console.error("Failed to parse configs, using defaults:", confError);
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

            // Weighted Score Calculation (Dynamic from settings):
            const hScore = (scoreEntry?.hafalan || 0) * (scoringWeight.hafalan / 100);
            const uScore = (scoreEntry?.ujianTulis || 0) * (scoringWeight.ujianTulis / 100);
            const qScore = (scoreEntry?.qiyamullail || 0) * (scoringWeight.qiyamullail / 100);
            const mScore = monitoringBase * (scoringWeight.monitoring / 100);

            const totalScore = Math.round(hScore + uScore + qScore + mScore + streakBonus);

            // Log calculation for first santri as sample
            if (results.length === 0) {
                console.log(`Sample Calculation (${s.name}):`, {
                    h: scoreEntry?.hafalan, hW: scoringWeight.hafalan,
                    u: scoreEntry?.ujianTulis, uW: scoringWeight.ujianTulis,
                    q: scoreEntry?.qiyamullail, qW: scoringWeight.qiyamullail,
                    m: monitoringBase, mW: scoringWeight.monitoring,
                    bonus: streakBonus,
                    total: totalScore
                });
            }

            // Persistent update to DB
            if (scoreEntry) {
                await db.update(scoresTable)
                    .set({
                        monitoring: monitoringBase,
                        totalScore: totalScore,
                        streakCount: streak,
                        bestStreak: Math.max(scoreEntry.bestStreak || 0, streak),
                        lastStreakDay: days.length > 0 ? days[0] : null,
                        updatedAt: new Date()
                    })
                    .where(eq(scoresTable.userId, s.id));
            } else {
                await db.insert(scoresTable).values({
                    userId: s.id,
                    monitoring: monitoringBase,
                    totalScore: totalScore,
                    streakCount: streak,
                    bestStreak: streak,
                    lastStreakDay: days.length > 0 ? days[0] : null,
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
