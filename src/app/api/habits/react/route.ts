import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/session";
import { getDb } from "@/lib/server/db";
import { amalanReactions } from "@/lib/server/db/schema";

export async function POST(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { amalanId, type, content } = await req.json();

        if (!amalanId || !type || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const db = getDb();

        await db.insert(amalanReactions).values({
            amalanId,
            userId: currentUser.id,
            type,
            content,
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Reaction error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
