import { getAdminSession } from "@/lib/admin";
import { getDb } from "@/lib/server/db";
import { user as userTable, lessons, progress, session as sessionTable, userAmalan } from "@/lib/server/db/schema";
import { count, eq, sql, isNotNull, countDistinct, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = getDb();

        // 1. Total Santri (Excluding Demo)
        const santriCountResult = await db.select({ value: count() })
            .from(userTable)
            .where(and(eq(userTable.role, 'santri'), sql`${userTable.id} != 'demo_santri'`));
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
            .innerJoin(userTable, eq(progress.userId, userTable.id))
            .where(and(
                sql`${progress.createdAt} LIKE ${today + '%'}`,
                sql`${userTable.id} != 'demo_santri'`
            ));
        const checkinsToday = checkinsTodayResult[0]?.value || 0;
        
        // --- REFINED METRICS ---
        
        // 5. Students Logged In Breakdown (excluding demo)
        const loggedInByRole = await db.select({ 
            role: userTable.role, 
            count: countDistinct(sessionTable.userId) 
        })
            .from(sessionTable)
            .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
            .where(sql`${userTable.id} != 'demo_santri'`)
            .groupBy(userTable.role)
            .all();
            
        const loginStats = {
            santri: loggedInByRole.find(r => r.role === 'santri')?.count || 0,
            mentor: loggedInByRole.find(r => r.role === 'mentor')?.count || 0,
            wali: loggedInByRole.find(r => r.role === 'parent')?.count || 0,
            admin: loggedInByRole.find(r => r.role === 'admin')?.count || 0,
        };
        
        // 6. Overall Students Doing Tasks (excluding demo)
        const overallActivityCountResult = await db.select({ value: countDistinct(userAmalan.userId) })
            .from(userAmalan)
            .where(sql`${userAmalan.userId} != 'demo_santri'`);
        const overallActivity = overallActivityCountResult[0]?.value || 0;
        
        // 7. Daily Task activity (unique students per day & percentage)
        const dailyActivityRaw = await db.select({ 
            day: userAmalan.day, 
            count: countDistinct(userAmalan.userId) 
        })
            .from(userAmalan)
            .where(and(isNotNull(userAmalan.day), sql`${userAmalan.userId} != 'demo_santri'`))
            .groupBy(userAmalan.day)
            .all();
            
        const dailyActivity = dailyActivityRaw.map(da => ({
            ...da,
            percentage: totalSantri > 0 ? ((da.count / totalSantri) * 100).toFixed(1) : "0"
        }));
        
        // 8. Average Task Uploads (total verified tasks / total santri)
        const totalVerifiedTasksResult = await db.select({ value: count() })
            .from(userAmalan)
            .where(and(eq(userAmalan.status, 'verified'), sql`${userAmalan.userId} != 'demo_santri'`));
        const totalVerifiedTasks = totalVerifiedTasksResult[0]?.value || 0;
        const averageUploads = totalSantri > 0 ? (totalVerifiedTasks / totalSantri).toFixed(2) : "0";

        return NextResponse.json({
            totalSantri,
            totalLessons,
            pendingApprovals,
            checkinsToday,
            loginStats,
            overallActivity,
            dailyActivity,
            averageUploads
        });
    } catch (error) {
        console.error("Admin stats GET error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
