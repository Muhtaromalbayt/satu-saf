export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { lessonId, result } = await req.json();

        // TODO: Implement real XP/heart logic with Drizzle when ready
        if (result.isCorrect) {
            return NextResponse.json({ message: "Correct! XP Added.", correct: true });
        } else {
            return NextResponse.json({ message: "Wrong! Heart lost.", correct: false });
        }

    } catch (error) {
        console.error("Quiz Submit Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
