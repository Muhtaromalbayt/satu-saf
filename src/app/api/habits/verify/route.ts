import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/session";
import { getDb } from "@/lib/server/db";
import { userAmalan } from "@/lib/server/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

/**
 * POST /api/habits/verify
 * Allows a mentor or parent to verify a habit log entry.
 * Body: { logId: number, verified: boolean, parentNote?: string }
 */
export async function POST(req: Request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser || (currentUser.role !== 'mentor' && currentUser.role !== 'parent')) {
            return NextResponse.json({ error: "Unauthorized. Only mentor or parent can verify." }, { status: 401 });
        }

        const { logId, verified, parentNote } = await req.json();

        if (!logId) {
            return NextResponse.json({ error: "Missing logId" }, { status: 400 });
        }

        const db = getDb();

        await db.update(userAmalan)
            .set({
                verifiedByMentor: verified ?? true,
                mentorNote: parentNote || null
            })
            .where(eq(userAmalan.id, logId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Habit verification error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
