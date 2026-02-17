import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from 'next/server';

export const runtime = "edge";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        if (!supabase) {
            return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
        }
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { lessonId, result } = await req.json(); // result: { isCorrect: boolean }
        const userId = user.id;

        if (result.isCorrect) {
            // 1. Add XP and update activity
            // Using direct updates for now as fallback for no RPC
            const { data: userData } = await supabase.from('users').select('xp').eq('id', userId).single();
            await supabase
                .from('users')
                .update({
                    xp: (userData?.xp || 0) + 10,
                    last_active_at: new Date().toISOString()
                })
                .eq('id', userId);

            // 2. Mark Lesson as Complete in Progress
            const { data: existingProgress } = await supabase
                .from('progress')
                .select('*')
                .eq('user_id', userId)
                .eq('lesson_id', lessonId)
                .single();

            if (!existingProgress) {
                await supabase
                    .from('progress')
                    .insert({
                        user_id: userId,
                        lesson_id: lessonId,
                        is_verified: true
                    });
            }

            return NextResponse.json({ message: "Correct! XP Added.", correct: true });

        } else {
            // Wrong Answer: Decrement Hearts
            const { data: userData } = await supabase.from('users').select('hearts').eq('id', userId).single();
            await supabase
                .from('users')
                .update({
                    hearts: Math.max(0, (userData?.hearts || 0) - 1),
                    last_active_at: new Date().toISOString()
                })
                .eq('id', userId);

            return NextResponse.json({ message: "Wrong! Heart lost.", correct: false });
        }

    } catch (error) {
        console.error("Quiz Submit Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
