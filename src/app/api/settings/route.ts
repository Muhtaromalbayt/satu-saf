import { NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { systemSettings } from "@/lib/server/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const db = getDb();
        const setting = await db.select()
            .from(systemSettings)
            .where(eq(systemSettings.key, "current_journey_day"))
            .get();

        return NextResponse.json({
            currentDay: setting ? parseInt(setting.value) : 1
        });
    } catch (error) {
        console.error("Settings GET error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
