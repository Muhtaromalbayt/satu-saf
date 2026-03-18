import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { dailyMonitoring } from "@/lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/server/session";

const VALID_ASPECTS = ["ibadah", "orang_tua", "lingkungan", "diri_sendiri"] as const;
type Aspect = typeof VALID_ASPECTS[number];

/**
 * GET /api/monitoring/log
 * Returns all daily monitoring records for the current user.
 */
export async function GET(_req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getDb();
    const logs = await db
        .select()
        .from(dailyMonitoring)
        .where(eq(dailyMonitoring.userId, user.id));

    return NextResponse.json({ logs });
}

/**
 * POST /api/monitoring/log
 * Body: { day: number (1-14), aspect: string, isDone: boolean, notes?: string }
 * Upserts a monitoring record for the current day+aspect.
 */
export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const { day, aspect, isDone, notes } = body;

    if (!day || day < 1 || day > 14) {
        return NextResponse.json({ error: "Hari harus antara 1 dan 14" }, { status: 400 });
    }
    if (!VALID_ASPECTS.includes(aspect as Aspect)) {
        return NextResponse.json({ error: "Aspek tidak valid" }, { status: 400 });
    }

    const db = getDb();
    const existing = await db
        .select()
        .from(dailyMonitoring)
        .where(and(eq(dailyMonitoring.userId, user.id), eq(dailyMonitoring.day, day), eq(dailyMonitoring.aspect, aspect)))
        .get();

    if (existing) {
        await db
            .update(dailyMonitoring)
            .set({ isDone: isDone ?? false, notes: notes || null })
            .where(eq(dailyMonitoring.id, existing.id));
    } else {
        await db.insert(dailyMonitoring).values({
            userId: user.id,
            day,
            aspect,
            isDone: isDone ?? false,
            notes: notes || null,
        });
    }

    return NextResponse.json({ success: true });
}
