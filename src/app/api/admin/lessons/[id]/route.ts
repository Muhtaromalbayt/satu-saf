import { getAdminSession } from "@/lib/admin";
import { getDb } from "@/lib/server/db";
import { lessons } from "@/lib/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const data = await req.json();
        const { chapter, type, title, content } = data;

        const db = getDb();

        await db.update(lessons)
            .set({
                chapter: chapter !== undefined ? Number(chapter) : undefined,
                type: type || undefined,
                title: title !== undefined ? title : undefined,
                content: content !== undefined
                    ? (typeof content === 'string' ? content : JSON.stringify(content))
                    : undefined,
            })
            .where(eq(lessons.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin lessons PUT error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const db = getDb();

        await db.delete(lessons).where(eq(lessons.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin lessons DELETE error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
