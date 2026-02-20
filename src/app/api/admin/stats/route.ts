export const runtime = 'edge';

import { getAdminSession } from "@/lib/admin";
import { getDb } from "@/lib/server/db";
import { user as userTable, lessons, progress } from "@/lib/server/db/schema";
import { count, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = getDb();

        // 1. Total Santri
        const santriCountResult = await db.select({ value: count() })
            .from(userTable)
            .where(eq(userTable.role, 'santri'));
        const totalSantri = santriCountResult[0]?.value || 0;

        // 2. Total Lessons
        const lessonsCountResult = await db.select({ value: count() })
            .from(lessons);
        const totalLessons = lessonsCountResult[0]?.value || 0;

        // 3. Pending Approvals (isVerified = false)
        const pendingApprovalsResult = await db.select({ value: count() })
            .from(progress)
            .where(eq(progress.isVerified, false));
        const pendingApprovals = pendingApprovalsResult[0]?.value || 0;

        // 4. Check-ins Today (created_at starts with today's YYYY-MM-DD)
        const today = new Date().toISOString().split('T')[0];
        const checkinsTodayResult = await db.select({ value: count() })
            .from(progress)
            .where(sql`${progress.createdAt} LIKE ${today + '%'}`);
        const checkinsToday = checkinsTodayResult[0]?.value || 0;

        return NextResponse.json({
            totalSantri,
            totalLessons,
            pendingApprovals,
            checkinsToday,
        });
    } catch (error) {
        console.error("Admin stats GET error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
