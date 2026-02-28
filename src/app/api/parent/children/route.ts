import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/lib/server/db";
import { user, userAmalan } from "@/lib/server/db/schema";
import { eq, sql, and } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user || (session.user as any).role !== 'parent') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = getDb();

        // Get all children linked to this parent
        const children = await db.select()
            .from(user)
            .where(eq(user.parentId, session.user.id));

        // For each child, we might want to get their today's progress summary
        const today = new Date().toISOString().split('T')[0];

        const childrenWithProgress = await Promise.all(children.map(async (child) => {
            const logs = await db.select({
                count: sql<number>`count(*)`,
                verifiedCount: sql<number>`count(case when verified_by_parent = 1 then 1 end)`
            })
                .from(userAmalan)
                .where(
                    and(
                        eq(userAmalan.userId, child.id),
                        sql`date(${userAmalan.timestamp}) = ${today}`
                    )
                ).get();

            return {
                ...child,
                todayProgress: logs || { count: 0, verifiedCount: 0 }
            };
        }));

        return NextResponse.json({ children: childrenWithProgress });
    } catch (error) {
        console.error("Parent children fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
