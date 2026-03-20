import { NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { user as userTable, scores as scoresTable } from "@/lib/server/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const db = getDb();
        const demoId = "demo_santri";

        // 1. Check if demo user exists
        const existing = await db.select().from(userTable).where(eq(userTable.id, demoId)).get();

        if (!existing) {
            await db.insert(userTable).values({
                id: demoId,
                name: "Santri Demo",
                kelompok: "DEMO",
                role: "santri",
                pin: "1234",
            });

            // Initialize score entry
            await db.insert(scoresTable).values({
                userId: demoId,
                hafalan: 0,
                ujianTulis: 0,
                qiyamullail: 0,
                monitoring: 0,
            });

            return NextResponse.json({ success: true, message: "Demo account created successfully" });
        } else {
            return NextResponse.json({ success: true, message: "Demo account already exists" });
        }
    } catch (error: any) {
        console.error("Demo seed error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
