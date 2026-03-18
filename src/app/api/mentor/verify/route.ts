import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/session";
import { getDb } from "@/lib/server/db";
import { userAmalan } from "@/lib/server/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user || user.role !== "mentor") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, status, mentorNote } = await req.json();

        if (!id || !status) {
            return NextResponse.json({ error: "Id and status are required" }, { status: 400 });
        }

        const db = getDb();

        await db.update(userAmalan)
            .set({
                status,
                verifiedByMentor: true,
                mentorNote: mentorNote || null
            })
            .where(eq(userAmalan.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Mentor verify error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
