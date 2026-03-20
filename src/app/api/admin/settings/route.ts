import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { systemSettings } from "@/lib/server/db/schema";
import { eq, inArray } from "drizzle-orm";
import { getAdminSession } from "@/lib/admin";

export async function GET(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = getDb();
        const settings = await db.select()
            .from(systemSettings)
            .where(inArray(systemSettings.key, ["streak_config", "mission_start_date", "current_journey_day", "scoring_weight"]))
            .all();

        const config: Record<string, any> = {};
        settings.forEach(s => {
            if (s.key === "streak_config" || s.key === "scoring_weight") {
                config[s.key] = JSON.parse(s.value);
            } else {
                config[s.key] = s.value;
            }
        });

        // Defaults
        if (!config.streak_config) {
            config.streak_config = [
                { days: 3, points: 50 },
                { days: 7, points: 150 },
                { days: 14, points: 500 }
            ];
        }

        if (!config.scoring_weight) {
            config.scoring_weight = {
                hafalan: 15,
                ujianTulis: 15,
                qiyamullail: 20,
                monitoring: 50
            };
        }
        if (!config.current_journey_day) config.current_journey_day = "1";

        return NextResponse.json(config);
    } catch (error: any) {
        console.error("Admin settings GET error:", error);
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

        const updates = Object.entries(body);

        for (const [key, value] of updates) {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

            const existing = await db.select()
                .from(systemSettings)
                .where(eq(systemSettings.key, key))
                .get();

            if (existing) {
                await db.update(systemSettings)
                    .set({
                        value: stringValue,
                        updatedAt: new Date().toISOString()
                    })
                    .where(eq(systemSettings.key, key));
            } else {
                await db.insert(systemSettings).values({
                    key: key,
                    value: stringValue,
                });
            }
        }

        return NextResponse.json({ success: true, message: "Settings saved." });
    } catch (error: any) {
        console.error("Admin settings POST error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
