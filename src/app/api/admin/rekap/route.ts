import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { user as userTable, scores as scoresTable, userAmalan, systemSettings } from "@/lib/server/db/schema";
import { eq, and, sql, inArray } from "drizzle-orm";
import { MONITORING_ASPECTS } from "@/lib/constants/monitoring";
import { getAdminSession } from "@/lib/admin";

export async function GET(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = getDb();

        // 1. Fetch all santri (Excluding Demo)
        const santris = await db.select()
            .from(userTable)
            .where(and(eq(userTable.role, 'santri'), sql`${userTable.id} != 'demo_santri'`))
            .all();

        // 2. Fetch all scores
        const scores = await db.select()
            .from(scoresTable)
            .all();

        // 3. Calculate Monitoring Scores
        // Calculate total possible tasks
        const totalTasksPerDay = MONITORING_ASPECTS.reduce((acc, aspect) => acc + (aspect.tasks?.length || 0), 0);
        const totalPossibleTasks = totalTasksPerDay * 14;

        // Fetch verified tasks count for each user
        const verifiedCounts = await db.select({
            userId: userAmalan.userId,
            count: sql<number>`count(*)`
        })
            .from(userAmalan)
            .where(eq(userAmalan.status, 'verified'))
            .groupBy(userAmalan.userId)
            .all();

        const verifiedMap = new Map(verifiedCounts.map(vc => [vc.userId, vc.count]));

        // Fetch Streak & Scoring Weight Configs
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
        } catch (wErr) {
            console.error("Failed to fetch configs in Rekap, using defaults:", wErr);
        }

        // Fetch user logs for streak calculation
        const allVerifiedLogs = await db.select({
            userId: userAmalan.userId,
            day: userAmalan.day
        })
            .from(userAmalan)
            .where(eq(userAmalan.status, 'verified'))
            .all();

        const userLogsMap = new Map<string, number[]>();
        for (const log of allVerifiedLogs) {
            if (!userLogsMap.has(log.userId)) userLogsMap.set(log.userId, []);
            if (log.day !== null && !userLogsMap.get(log.userId)!.includes(log.day)) {
                userLogsMap.get(log.userId)!.push(log.day);
            }
        }

        // 4. Combine data
        const rekap = santris.map(s => {
            const score = scores.find(sc => sc.userId === s.id);
            const verifiedCount = verifiedMap.get(s.id) || 0;
            const monitoringScore = totalPossibleTasks > 0
                ? parseFloat(((verifiedCount / totalPossibleTasks) * 100).toFixed(2))
                : 0;

            // Streak Calculation (matching sync logic)
            const days = userLogsMap.get(s.id) || [];
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

            let streakBonus = 0;
            const sortedConfig = [...streakConfig].sort((a, b) => b.days - a.days);
            for (const conf of sortedConfig) {
                if (streak >= conf.days) {
                    streakBonus = conf.points;
                    break;
                }
            }

            const hScore = (score?.hafalan || 0) * (scoringWeight.hafalan / 100);
            const uScore = (score?.ujianTulis || 0) * (scoringWeight.ujianTulis / 100);
            const qScore = (score?.qiyamullail || 0) * (scoringWeight.qiyamullail / 100);
            const mScore = monitoringScore * (scoringWeight.monitoring / 100);

            return {
                id: s.id,
                name: s.name,
                kelompok: s.kelompok,
                hafalan: score?.hafalan || 0,
                ujianTulis: score?.ujianTulis || 0,
                qiyamullail: score?.qiyamullail || 0,
                monitoring: monitoringScore,
                streak: streak,
                streakBonus: streakBonus,
                total: Math.round(hScore + uScore + qScore + mScore + streakBonus)
            };
        });

        return NextResponse.json(rekap);

    } catch (error: any) {
        console.error("Rekap GET error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = getDb();
        const body = await req.json();
        const { userId, hafalan, ujianTulis, qiyamullail } = body;

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Check if score entry exists
        const existingScore = await db.select()
            .from(scoresTable)
            .where(eq(scoresTable.userId, userId))
            .get();

        // 3. Recalculate totalScore immediately for sync
        const totalTasksPerDay = MONITORING_ASPECTS.reduce((acc, aspect) => acc + (aspect.tasks?.length || 0), 0);
        const totalPossibleTasks = totalTasksPerDay * 14;

        // Fetch verified tasks count for this user
        const verifiedCountResult = await db.select({
            count: sql<number>`count(*)`
        })
            .from(userAmalan)
            .where(and(eq(userAmalan.userId, userId), eq(userAmalan.status, 'verified')))
            .get();
        const verifiedCount = verifiedCountResult?.count || 0;
        const monitoringScore = totalPossibleTasks > 0 ? (verifiedCount / totalPossibleTasks) * 100 : 0;

        // Fetch Streak & Scoring Weight Configs
        let streakConfig = [{ days: 3, points: 50 }, { days: 7, points: 150 }, { days: 14, points: 500 }];
        let scoringWeight = { hafalan: 15, ujianTulis: 15, qiyamullail: 20, monitoring: 50 };

        const settings = await db.select().from(systemSettings).where(inArray(systemSettings.key, ["streak_config", "scoring_weight"])).all();
        const streakSet = settings.find(s => s.key === "streak_config");
        if (streakSet) {
            const parsed = JSON.parse(streakSet.value);
            if (Array.isArray(parsed)) streakConfig = parsed;
        }
        const weightSet = settings.find(s => s.key === "scoring_weight");
        if (weightSet) {
            scoringWeight = JSON.parse(weightSet.value);
        }

        // Fetch user logs for streak
        const userLogs = await db.select({ day: userAmalan.day }).from(userAmalan).where(and(eq(userAmalan.userId, userId), eq(userAmalan.status, 'verified'))).all();
        const days = userLogs.map(l => l.day as number).filter(d => d !== null);
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

        let streakBonus = 0;
        const sortedConfig = [...streakConfig].sort((a, b) => b.days - a.days);
        for (const conf of sortedConfig) {
            if (streak >= conf.days) {
                streakBonus = conf.points;
                break;
            }
        }

        const newHafalan = hafalan !== undefined ? hafalan : (existingScore?.hafalan || 0);
        const newUjian = ujianTulis !== undefined ? ujianTulis : (existingScore?.ujianTulis || 0);
        const newQiyam = qiyamullail !== undefined ? qiyamullail : (existingScore?.qiyamullail || 0);

        const hScore = newHafalan * (scoringWeight.hafalan / 100);
        const uScore = newUjian * (scoringWeight.ujianTulis / 100);
        const qScore = newQiyam * (scoringWeight.qiyamullail / 100);
        const mScore = monitoringScore * (scoringWeight.monitoring / 100);
        const totalScore = Math.round(hScore + uScore + qScore + mScore + streakBonus);

        // 4. Update or Insert final scores including totalScore
        if (existingScore) {
            await db.update(scoresTable)
                .set({
                    hafalan: newHafalan,
                    ujianTulis: newUjian,
                    qiyamullail: newQiyam,
                    monitoring: monitoringScore,
                    totalScore: totalScore,
                    streakCount: streak,
                    updatedAt: new Date()
                })
                .where(eq(scoresTable.userId, userId));
        } else {
            await db.insert(scoresTable).values({
                userId,
                hafalan: newHafalan,
                ujianTulis: newUjian,
                qiyamullail: newQiyam,
                monitoring: monitoringScore,
                totalScore: totalScore,
                streakCount: streak,
            });
        }

        return NextResponse.json({ 
            message: "Score updated successfully", 
            totalScore,
            monitoring: monitoringScore 
        });

    } catch (error) {
        console.error("Rekap PATCH error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = getDb();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Delete user (cascades to scores, sessions, userAmalan, etc. based on schema)
        await db.delete(userTable).where(eq(userTable.id, userId));

        return NextResponse.json({ message: "Data santri berhasil dihapus" });

    } catch (error: any) {
        console.error("Rekap DELETE error:", error);
        return NextResponse.json({ 
            error: "Internal Server Error",
            details: error.message 
        }, { status: 500 });
    }
}
