import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from "@/lib/server/session";

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { lessonId, result } = await req.json();

        if (result.isCorrect) {
            return NextResponse.json({ message: "Jawaban Benar! Poin Ditambahkan.", correct: true });
        } else {
            return NextResponse.json({ message: "Wrong! Heart lost.", correct: false });
        }

    } catch (error) {
        console.error("Quiz Submit Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
