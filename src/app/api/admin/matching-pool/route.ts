import { getAdminSession } from "@/lib/admin";
import { getDb } from "@/lib/server/db";
import { matchingPool } from "@/lib/server/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");

        const db = getDb();
        let query = db.select().from(matchingPool);

        if (category) {
            query = query.where(eq(matchingPool.category, category)) as any;
        }

        const items = await query.orderBy(desc(matchingPool.createdAt));

        return NextResponse.json(items);
    } catch (error) {
        console.error("Admin matching-pool GET error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const { left, right, category } = data;

        if (!left || !right) {
            return NextResponse.json({ error: "Left and Right items are required" }, { status: 400 });
        }

        const db = getDb();

        // Check for duplicates
        const existing = await db.select().from(matchingPool).where(
            and(
                eq(matchingPool.left, left),
                eq(matchingPool.right, right)
            )
        ).limit(1);

        if (existing.length > 0) {
            return NextResponse.json({ error: "This pair already exists" }, { status: 400 });
        }

        const result = await db.insert(matchingPool).values({
            left,
            right,
            category: category || null,
        }).returning();

        return NextResponse.json({ success: true, item: result[0] });
    } catch (error) {
        console.error("Admin matching-pool POST error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
