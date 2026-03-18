import { getCurrentUser } from "@/lib/server/session";
import { getDb } from "@/lib/server/db";
import { user as userTable } from "@/lib/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * TEMPORARY: Allows claiming admin role for the currently logged-in user.
 */
export async function POST() {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
        }

        const db = getDb();

        await db.update(userTable)
            .set({ role: 'admin' })
            .where(eq(userTable.id, currentUser.id));

        return NextResponse.json({
            success: true,
            message: `User ${currentUser.name} is now an ADMIN. Please re-login to update session.`
        });
    } catch (error) {
        console.error("Admin claim error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
