import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { monitoringTasks } from "@/lib/server/db/schema";
import { eq, asc, and } from "drizzle-orm";

/**
 * GET /api/tasks
 * Returns all active monitoring tasks.
 */
export async function GET(_req: NextRequest) {
    const db = getDb();
    const tasks = await db.select()
        .from(monitoringTasks)
        .where(eq(monitoringTasks.isActive, true))
        .orderBy(asc(monitoringTasks.displayOrder));

    return NextResponse.json({ tasks });
}
