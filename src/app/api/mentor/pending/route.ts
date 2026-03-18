import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/session";
import { getDb } from "@/lib/server/db";
import { userAmalan, user as userTable } from "@/lib/server/db/schema";
import { eq, and } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user || user.role !== "mentor") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = getDb();

        // Fetch logs with status 'pending', joining with user for name
        const pendingItems = await db.select({
            id: userAmalan.id,
            studentName: userTable.name,
            aspect: userAmalan.aspect,
            deedName: userAmalan.deedName,
            day: userAmalan.day,
            status: userAmalan.status,
            evidenceUrl: userAmalan.evidenceUrl,
            reflection: userAmalan.reflection,
            capturedAt: userAmalan.capturedAt,
            timestamp: userAmalan.timestamp
        })
            .from(userAmalan)
            .innerJoin(userTable, eq(userAmalan.userId, userTable.id))
            .where(
                and(
                    eq(userAmalan.status, "pending"),
                    eq(userTable.kelompok, user.kelompok)
                )
            )
            .all();

        return NextResponse.json({ items: pendingItems });
    } catch (error) {
        console.error("Mentor pending fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
