import { NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { systemSettings } from "@/lib/server/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/server/session";

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

export async function PATCH(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { currentDay } = await req.json();
        if (typeof currentDay !== "number" || currentDay < 1 || currentDay > 14) {
            return NextResponse.json({ error: "Invalid day" }, { status: 400 });
        }

        const db = getDb();
        await db.insert(systemSettings)
            .values({
                key: "current_journey_day",
                value: currentDay.toString(),
                updatedAt: new Date().toISOString()
            })
            .onConflictDoUpdate({
                target: systemSettings.key,
                set: {
                    value: currentDay.toString(),
                    updatedAt: new Date().toISOString()
                }
            });

        return NextResponse.json({ success: true, currentDay });
    } catch (error) {
        console.error("Settings PATCH error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
