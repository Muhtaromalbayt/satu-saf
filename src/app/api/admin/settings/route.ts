import { NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { systemSettings } from "@/lib/server/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/server/session";

export async function GET() {
    try {
        const db = getDb();
        const settings = await db.select()
            .from(systemSettings)
            .all();

        const config: Record<string, string> = {};
        settings.forEach(s => {
            config[s.key] = s.value;
        });

        return NextResponse.json({
            currentDay: parseInt(config["current_journey_day"] || "1"),
            missionStartDate: config["mission_start_date"] || "",
            missionStatus: config["mission_status"] || "open" // "open" or "closed"
        });
    } catch (error) {
        console.error("Settings GET error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const db = getDb();

        const updates = [];

        if (body.currentDay !== undefined) {
            updates.push({ key: "current_journey_day", value: body.currentDay.toString() });
        }
        if (body.missionStartDate !== undefined) {
            updates.push({ key: "mission_start_date", value: body.missionStartDate });
        }
        if (body.missionStatus !== undefined) {
            updates.push({ key: "mission_status", value: body.missionStatus });
        }

        for (const update of updates) {
            await db.insert(systemSettings)
                .values({
                    key: update.key,
                    value: update.value,
                    updatedAt: new Date().toISOString()
                })
                .onConflictDoUpdate({
                    target: systemSettings.key,
                    set: {
                        value: update.value,
                        updatedAt: new Date().toISOString()
                    }
                });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Settings PATCH error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
