import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/session";
import { getDb } from "@/lib/server/db";
import { user, dailyMonitoring } from "@/lib/server/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

/**
 * GET /api/parent/children
 * Returns all santri in the same kelompok for a mentor/parent role
 * (since we no longer have direct parent-child linking, we use kelompok grouping)
 */
export async function GET() {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser || (currentUser.role !== 'mentor' && currentUser.role !== 'parent')) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = getDb();

        // Get all santri
        const santriList = await db.select().from(user).where(eq(user.role, 'santri'));

        return NextResponse.json({ children: santriList });
    } catch (error) {
        console.error("Parent children fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
