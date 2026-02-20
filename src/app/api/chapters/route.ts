export const runtime = 'edge';

import { getChapters } from "@/lib/server/lessons";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        const chapters = await getChapters(session?.user?.id);
        return NextResponse.json(chapters);
    } catch (error) {
        console.error("Chapters GET error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
