import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/session";
import { getDb } from "@/lib/server/db";
import { userAmalan, scores, userBadges } from "@/lib/server/db/schema";
import { eq, and, sql } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = getDb();

        // 1. Get total verified deeds
        const totalVerified = await db.select({ count: sql<number>`count(*)` })
            .from(userAmalan)
            .where(and(eq(userAmalan.userId, user.id), eq(userAmalan.status, 'verified')));

        // 2. Get peak streak and current score
        const score = await db.select().from(scores).where(eq(scores.userId, user.id)).get();

        // 3. Get all badges
        const badges = await db.select().from(userBadges).where(eq(userBadges.userId, user.id));

        // 4. Get most frequent aspect
        const topAspect = await db.select({ 
            aspect: userAmalan.aspect, 
            count: sql<number>`count(*)` 
        })
        .from(userAmalan)
        .where(and(eq(userAmalan.userId, user.id), eq(userAmalan.status, 'verified')))
        .groupBy(userAmalan.aspect)
        .orderBy(sql`count(*) DESC`)
        .limit(1);

        return NextResponse.json({
            stats: {
                totalVerified: totalVerified[0]?.count || 0,
                streak: score?.streakCount || 0,
                totalScore: score?.totalScore || 0,
                topBadge: badges.length > 0 ? badges[badges.length - 1].badgeType : null,
                totalBadges: badges.length,
                topAspect: topAspect[0]?.aspect || 'Ibadah'
            },
            badges: badges.map(b => b.badgeType)
        });
    } catch (error) {
        console.error("Wrapped fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
