import { getDb } from "../lib/server/db";
import { monitoringTasks } from "../lib/server/db/schema";
import { MONITORING_ASPECTS } from "../lib/constants/monitoring";
import { eq, and } from "drizzle-orm";

async function seedTasks() {
    const db = getDb();
    console.log("🌱 Seeding monitoring tasks from constants...");

    for (const aspect of MONITORING_ASPECTS) {
        console.log(`Processing aspect: ${aspect.label}`);
        for (let i = 0; i < aspect.tasks.length; i++) {
            const taskLabel = aspect.tasks[i];
            const isMandatory = ["Sholat Subuh", "Sholat Dzuhur", "Sholat Ashar", "Sholat Maghrib", "Sholat Isya"].includes(taskLabel);

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
                    isActive: isMandatory
                });
                console.log(`  + Added: ${taskLabel}`);
            } else {
                console.log(`  - Skipping (exists): ${taskLabel}`);
            }
        }
    }

    console.log("✅ Seeding complete!");
}

seedTasks().catch(err => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
});
