import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { monitoringTasks } from "@/lib/server/db/schema";
import { eq, asc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/server/session";

/**
 * GET /api/admin/tasks
 * Returns all monitoring tasks.
 */
export async function GET(_req: NextRequest) {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const tasks = await db.select()
        .from(monitoringTasks)
        .orderBy(asc(monitoringTasks.displayOrder));

    return NextResponse.json({ tasks });
}

/**
 * POST /api/admin/tasks
 * Body: { aspectId, label, displayOrder? }
 * Creates a new task.
 */
export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.aspectId || !body.label) {
        return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const db = getDb();
    const result = await db.insert(monitoringTasks).values({
        aspectId: body.aspectId,
        label: body.label,
        displayOrder: body.displayOrder ?? 0,
        isActive: true,
    }).returning();

    return NextResponse.json({ success: true, task: result[0] });
}

/**
 * PATCH /api/admin/tasks/:id
 * Body: { label, isActive, displayOrder }
 */
// NOTE: Next.js doesn't support dynamic segments in a single route file easily without extra config,
// we'll handle this in a separate file or use searchParams / body ID.
export async function PATCH(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.id) {
        return NextResponse.json({ error: "Missing task ID" }, { status: 400 });
    }

    const db = getDb();
    await db.update(monitoringTasks)
        .set({
            label: body.label,
            isActive: body.isActive,
            displayOrder: body.displayOrder
        })
        .where(eq(monitoringTasks.id, body.id));

    return NextResponse.json({ success: true });
}

/**
 * DELETE /api/admin/tasks
 * Body: { id }
 */
export async function DELETE(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.id) {
        return NextResponse.json({ error: "Missing task ID" }, { status: 400 });
    }

    const db = getDb();
    await db.delete(monitoringTasks).where(eq(monitoringTasks.id, body.id));

    return NextResponse.json({ success: true });
}
