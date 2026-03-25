import { getAdminSession } from "@/lib/admin";
import { getDb } from "@/lib/server/db";
import { user as userTable, lessons, progress, session as sessionTable, userAmalan } from "@/lib/server/db/schema";
import { count, eq, sql, isNotNull, countDistinct } from "drizzle-orm";
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
        
        // --- NEW METRICS ---
        
        // 5. Students Logged In (ever had a session)
        const loggedInCountResult = await db.select({ value: countDistinct(sessionTable.userId) })
            .from(sessionTable)
            .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
            .where(eq(userTable.role, 'santri'));
        const studentsLoggedIn = loggedInCountResult[0]?.value || 0;
        
        // 6. Overall Students Doing Tasks (at least one activity)
        const overallActivityCountResult = await db.select({ value: countDistinct(userAmalan.userId) })
            .from(userAmalan);
        const overallActivity = overallActivityCountResult[0]?.value || 0;
        
        // 7. Daily Task activity (unique students per day for last 14 days)
        const dailyActivityRaw = await db.select({ 
            day: userAmalan.day, 
            count: countDistinct(userAmalan.userId) 
        })
            .from(userAmalan)
            .where(isNotNull(userAmalan.day))
            .groupBy(userAmalan.day)
            .all();
        
        // 8. Average Task Uploads (total verified tasks / total santri)
        const totalVerifiedTasksResult = await db.select({ value: count() })
            .from(userAmalan)
            .where(eq(userAmalan.status, 'verified'));
        const totalVerifiedTasks = totalVerifiedTasksResult[0]?.value || 0;
        const averageUploads = totalSantri > 0 ? (totalVerifiedTasks / totalSantri).toFixed(2) : "0";

        return NextResponse.json({
            totalSantri,
            totalLessons,
            pendingApprovals,
            checkinsToday,
            studentsLoggedIn,
            overallActivity,
            dailyActivity: dailyActivityRaw,
            averageUploads
        });
    } catch (error) {
        console.error("Admin stats GET error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
