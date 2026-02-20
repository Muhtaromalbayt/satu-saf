export const runtime = 'edge';

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/server/db";
import { user as userTable } from "@/lib/server/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

/**
 * TEMPORARY: This route allows pinning the 'admin' role to the currently logged-in user.
 * In a real production app, this should be protected by an admin password or deleted after first use.
 */
export async function POST() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
        }

        const db = getDb();

        // Update user role to admin in the database
        await db.update(userTable)
            .set({ role: 'admin' })
            .where(eq(userTable.id, session.user.id));

        return NextResponse.json({
            success: true,
            message: `User ${session.user.email} is now an ADMIN. Please re-login to update session.`
        });
    } catch (error) {
        console.error("Admin claim error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
