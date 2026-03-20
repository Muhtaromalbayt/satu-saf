import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { systemSettings } from "@/lib/server/db/schema";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/admin";

export async function GET(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = getDb();
        const setting = await db.select()
            .from(systemSettings)
            .where(eq(systemSettings.key, "streak_config"))
            .get();

        const config = setting
            ? JSON.parse(setting.value)
            : [
                { days: 3, points: 50 },
                { days: 7, points: 150 },
                { days: 14, points: 500 }
            ];

        return NextResponse.json(config);
    } catch (error: any) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = getDb();
        const body = await req.json();

        // Ensure it's an array of {days, points}
        if (!Array.isArray(body)) {
            return NextResponse.json({ error: "Invalid format" }, { status: 400 });
        }

        const existing = await db.select()
            .from(systemSettings)
            .where(eq(systemSettings.key, "streak_config"))
            .get();

        if (existing) {
            await db.update(systemSettings)
                .set({
                    value: JSON.stringify(body),
                    updatedAt: new Date().toISOString()
                })
                .where(eq(systemSettings.key, "streak_config"));
        } else {
            await db.insert(systemSettings).values({
                key: "streak_config",
                value: JSON.stringify(body),
            });
        }

        return NextResponse.json({ success: true, message: "Streak configuration saved." });
    } catch (error: any) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
