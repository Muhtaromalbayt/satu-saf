import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/session";
import { getDb } from "@/lib/server/db";
import { userAmalan, scores, monitoringTasks, userBadges } from "@/lib/server/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";

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
            await updateStreak(db, user.id);
            await checkAndAwardBadges(db, user.id, day);
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
            await updateStreak(db, user.id);
            await checkAndAwardBadges(db, user.id, day);
            return NextResponse.json({ success: true, action: 'inserted', id: result[0].id });
        }
    } catch (error) {
        console.error("Habit log error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

async function updateStreak(db: any, userId: string) {
    try {
        // 1. Get all active mandatory tasks (Sholat 5 Waktu)
        const activeMandatoryTasks = await db.select()
            .from(monitoringTasks)
            .where(
                and(
                    eq(monitoringTasks.isActive, true),
                    sql`label IN ('Sholat Subuh', 'Sholat Dzuhur', 'Sholat Ashar', 'Sholat Maghrib', 'Sholat Isya')`
                )
            );
        
        const mandatoryCount = activeMandatoryTasks.length;
        if (mandatoryCount === 0) return;

        // 2. Fetch all user's verified/done logs
        const userLogs = await db.select()
            .from(userAmalan)
            .where(
                and(
                    eq(userAmalan.userId, userId),
                    sql`status IN ('done', 'verified')`
                )
            )
            .orderBy(desc(userAmalan.day));

        // 3. Group logs by day
        const dayMap = new Map<number, Set<string>>();
        for (const log of userLogs) {
            if (log.day === null) continue;
            if (!dayMap.has(log.day)) dayMap.set(log.day, new Set());
            dayMap.get(log.day)!.add(log.deedName);
        }

        // 4. Calculate streak (consecutive days with all mandatory tasks done)
        const completedDays = Array.from(dayMap.keys())
            .filter(d => {
                const deeds = dayMap.get(d)!;
                return activeMandatoryTasks.every((t: any) => deeds.has(t.label));
            })
            .sort((a, b) => b - a);

        let streak = 0;
        if (completedDays.length > 0) {
            let expected = completedDays[0];
            for (const d of completedDays) {
                if (d === expected) {
                    streak++;
                    expected--;
                } else break;
            }
        }

        // 5. Update scores table
        const existingScore = await db.select().from(scores).where(eq(scores.userId, userId)).get();
        if (existingScore) {
            await db.update(scores)
                .set({
                    streakCount: streak,
                    bestStreak: Math.max(existingScore.bestStreak || 0, streak),
                    lastStreakDay: completedDays.length > 0 ? completedDays[0] : null,
                    updatedAt: new Date()
                })
                .where(eq(scores.userId, userId));
        } else {
            await db.insert(scores).values({
                userId,
                streakCount: streak,
                bestStreak: streak,
                lastStreakDay: completedDays.length > 0 ? completedDays[0] : null,
                updatedAt: new Date()
            });
        }
    } catch (err) {
        console.error("Update streak error:", err);
    }
}

async function awardBadge(db: any, userId: string, badgeType: string) {
    try {
        const existing = await db.select().from(userBadges).where(
            and(eq(userBadges.userId, userId), eq(userBadges.badgeType, badgeType))
        ).get();
        if (!existing) {
            await db.insert(userBadges).values({ userId, badgeType });
        }
    } catch (err) {
        console.error("Award badge error:", err);
    }
}

async function checkAndAwardBadges(db: any, userId: string, day: number | null) {
    try {
        if (!day) return;

        // 1. Perfect Day Badge
        const activeTasks = await db.select().from(monitoringTasks).where(eq(monitoringTasks.isActive, true));
        const todayLogs = await db.select().from(userAmalan).where(
            and(eq(userAmalan.userId, userId), eq(userAmalan.day, day))
        );
        const verifiedCount = todayLogs.filter((l: any) => l.status === 'verified').length;
        if (verifiedCount >= activeTasks.length && activeTasks.length > 0) {
            await awardBadge(db, userId, 'perfect_day');
        }

        // 2. Streak Badges
        const score = await db.select().from(scores).where(eq(scores.userId, userId)).get();
        if (score) {
            if (score.streakCount >= 3) await awardBadge(db, userId, 'streak_3');
            if (score.streakCount >= 7) await awardBadge(db, userId, 'streak_7');
            if (score.streakCount >= 14) await awardBadge(db, userId, 'streak_14');
        }

        // 3. Special Mission Badge
        const specialMissionLog = todayLogs.find((l: any) => 
            l.status === 'verified' && (l.deedName.includes('Spesial') || l.aspect === 'secret')
        );
        if (specialMissionLog) {
            await awardBadge(db, userId, 'special_mission');
        }
    } catch (err) {
        console.error("Check badges error:", err);
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
