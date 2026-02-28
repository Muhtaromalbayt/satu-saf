import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/lib/server/db";
import { userAmalan, user } from "@/lib/server/db/schema";
import { eq, and } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user || (session.user as any).role !== 'parent') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { logId, verified, parentNote } = await req.json();

        if (!logId) {
            return NextResponse.json({ error: "Missing logId" }, { status: 400 });
        }

        const db = getDb();

        // Verify that the log belongs to a child of this parent
        const log = await db.select()
            .from(userAmalan)
            .innerJoin(user, eq(userAmalan.userId, user.id))
            .where(
                and(
                    eq(userAmalan.id, logId),
                    eq(user.parentId, session.user.id)
                )
            ).get();

        if (!log) {
            return NextResponse.json({ error: "Log not found or access denied" }, { status: 404 });
        }

        await db.update(userAmalan)
            .set({
                verifiedByParent: verified ?? true,
                parentNote: parentNote || null
            })
            .where(eq(userAmalan.id, logId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Habit verification error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
