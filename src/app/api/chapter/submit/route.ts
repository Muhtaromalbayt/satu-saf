import { getCurrentUser } from "@/lib/server/session";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { lessonId } = await req.json();

        if (!lessonId) {
            return NextResponse.json({ error: "Lesson ID is required" }, { status: 400 });
        }

        // Progress tracking is now done via daily_monitoring table
        // This endpoint is kept for backwards compatibility
        return NextResponse.json({ success: true, note: "Progress tracked via daily_monitoring" });
    } catch (error) {
        console.error("Chapter submission error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
