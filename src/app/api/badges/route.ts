import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/session";
import { getDb } from "@/lib/server/db";
import { userBadges } from "@/lib/server/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = getDb();
        const badges = await db.select()
            .from(userBadges)
            .where(eq(userBadges.userId, user.id));

        return NextResponse.json({ badges });
    } catch (error) {
        console.error("Badges fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
