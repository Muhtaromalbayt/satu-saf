import { getChapters } from "@/lib/server/lessons";
import { getCurrentUser } from "@/lib/server/session";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getCurrentUser();
        const chapters = await getChapters(user?.id);
        return NextResponse.json(chapters);
    } catch (error) {
        console.error("Chapters GET error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
