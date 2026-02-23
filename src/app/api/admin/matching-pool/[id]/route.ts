import { getAdminSession } from "@/lib/admin";
import { getDb } from "@/lib/server/db";
import { matchingPool } from "@/lib/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const id = parseInt(params.id);
        const data = await req.json();
        const { left, right, category } = data;

        const db = getDb();
        await db.update(matchingPool)
            .set({
                left: left || undefined,
                right: right || undefined,
                category: category !== undefined ? category : undefined
            })
            .where(eq(matchingPool.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin matching-pool PATCH error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const id = parseInt(params.id);
        const db = getDb();
        await db.delete(matchingPool).where(eq(matchingPool.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin matching-pool DELETE error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
