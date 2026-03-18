import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { monitoringTasks } from "@/lib/server/db/schema";
import { MONITORING_ASPECTS } from "@/lib/constants/monitoring";
import { eq, and } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const db = getDb();
        const results = [];

        for (const aspect of MONITORING_ASPECTS) {
            for (let i = 0; i < aspect.tasks.length; i++) {
                const taskLabel = aspect.tasks[i];

                // Check if exists
                const existing = await db.select()
                    .from(monitoringTasks)
                    .where(
                        and(
                            eq(monitoringTasks.label, taskLabel),
                            eq(monitoringTasks.aspectId, aspect.id)
                        )
                    )
                    .get();

                if (!existing) {
                    await db.insert(monitoringTasks).values({
                        aspectId: aspect.id,
                        label: taskLabel,
                        displayOrder: i,
                        isActive: true
                    });
                    results.push({ aspectId: aspect.id, label: taskLabel, status: "added" });
                } else {
                    results.push({ aspectId: aspect.id, label: taskLabel, status: "exists" });
                }
            }
        }

        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        console.error("Seed tasks error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
