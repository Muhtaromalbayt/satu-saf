export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';

// Environment wrapper for TypeScript to recognize DB binding
interface Env {
    DB: any; // D1Database
}

export async function POST(req: NextRequest) {
    try {
        const { userId, lessonId, result } = await req.json(); // result: { isCorrect: boolean }

        // Hack to get binding in Next.js (process.env.DB or req.env if using middleware)
        // For now assuming process.env.DB as per prompt instructions, typical in some CF setups
        const db = process.env.DB as any;

        if (!db) {
            // Fallback for local development without wrangler dev
            return NextResponse.json({ error: "Database binding not found" }, { status: 500 });
        }

        if (result.isCorrect) {
            // 1. Increment Quiz Progress
            // 2. Add XP
            await db.prepare(
                `UPDATE users SET xp = xp + 10, last_active_at = ? WHERE id = ?`
            ).bind(Date.now(), userId).run();

            // 3. Mark Lesson as Complete in Progress
            const existingProgress = await db.prepare(
                `SELECT * FROM progress WHERE user_id = ? AND lesson_id = ?`
            ).bind(userId, lessonId).first();

            if (!existingProgress) {
                await db.prepare(
                    `INSERT INTO progress (user_id, lesson_id, is_verified) VALUES (?, ?, 1)`
                ).bind(userId, lessonId).run();
            }

            return NextResponse.json({ message: "Correct! XP Added.", correct: true });

        } else {
            // Wrong Answer: Decrement Hearts
            await db.prepare(
                `UPDATE users SET hearts = MAX(0, hearts - 1), last_active_at = ? WHERE id = ?`
            ).bind(Date.now(), userId).run();

            return NextResponse.json({ message: "Wrong! Heart lost.", correct: false });
        }

    } catch (error) {
        console.error("Quiz Submit Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
