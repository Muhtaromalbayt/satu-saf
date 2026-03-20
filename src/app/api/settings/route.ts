import { NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { systemSettings } from "@/lib/server/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

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
            missionStatus: config["mission_status"] || "open"
        });
    } catch (error) {
        console.error("Settings GET error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
