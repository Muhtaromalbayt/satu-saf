
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/server/db";
import { progress } from "@/lib/server/db/schema";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { lessonId } = await req.json();

        if (!lessonId) {
            return NextResponse.json({ error: "Lesson ID is required" }, { status: 400 });
        }

        const db = getDb();

        // Check if progress already exists
        // (Optional: depending on whether we want to allow re-submission)

        await db.insert(progress).values({
            userId: session.user.id,
            lessonId: lessonId,
            isVerified: true, // Auto-verify for now or set to false if mentor needs to check
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Chapter submission error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
