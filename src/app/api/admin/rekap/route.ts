import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { user as userTable, scores as scoresTable, userAmalan } from "@/lib/server/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { MONITORING_ASPECTS } from "@/lib/constants/monitoring";
import { getAdminSession } from "@/lib/admin";

export async function GET(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = getDb();

        // 1. Fetch all santri
        const santris = await db.select()
            .from(userTable)
            .where(eq(userTable.role, 'santri'))
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

        // 4. Combine data
        const rekap = santris.map(s => {
            const score = scores.find(sc => sc.userId === s.id);
            const verifiedCount = verifiedMap.get(s.id) || 0;
            const monitoringScore = totalPossibleTasks > 0
                ? parseFloat(((verifiedCount / totalPossibleTasks) * 100).toFixed(2))
                : 0;

            return {
                id: s.id,
                name: s.name,
                kelompok: s.kelompok,
                hafalan: score?.hafalan || 0,
                ujianTulis: score?.ujianTulis || 0,
                qiyamullail: score?.qiyamullail || 0,
                monitoring: monitoringScore,
                total: (score?.hafalan || 0) + (score?.ujianTulis || 0) + (score?.qiyamullail || 0) + monitoringScore
            };
        });

        return NextResponse.json(rekap);

    } catch (error: any) {
        console.error("Rekap GET error:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            message: error.message
        }, { status: 500 });
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

        if (existingScore) {
            await db.update(scoresTable)
                .set({
                    hafalan: hafalan !== undefined ? hafalan : existingScore.hafalan,
                    ujianTulis: ujianTulis !== undefined ? ujianTulis : existingScore.ujianTulis,
                    qiyamullail: qiyamullail !== undefined ? qiyamullail : existingScore.qiyamullail,
                    updatedAt: new Date()
                })
                .where(eq(scoresTable.userId, userId));
        } else {
            await db.insert(scoresTable).values({
                userId,
                hafalan: hafalan || 0,
                ujianTulis: ujianTulis || 0,
                qiyamullail: qiyamullail || 0,
            });
        }

        return NextResponse.json({ message: "Score updated successfully" });

    } catch (error) {
        console.error("Rekap PATCH error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
