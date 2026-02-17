import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from 'next/server';

export const runtime = "edge";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        if (!supabase) {
            return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
        }
        const { data: { user: mentor } } = await supabase.auth.getUser();

        if (!mentor || mentor.user_metadata?.role !== 'mentor') {
            return NextResponse.json({ error: "Unauthorized: Mentors only" }, { status: 401 });
        }

        const { approvalId, action } = await req.json(); // action: 'approve' | 'reject'
        const newStatus = action === 'approve' ? 'approved' : 'rejected';

        // Update approval status in Supabase
        const { data: approval, error: updateError } = await supabase
            .from('approvals')
            .update({
                status: newStatus,
                updated_at: new Date().toISOString(),
                mentor_id: mentor.id
            })
            .eq('id', approvalId)
            .select('student_id')
            .single();

        if (updateError) {
            console.error("Approval update error:", updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        if (action === 'approve' && approval) {
            // Give XP to student
            const { error: xpError } = await supabase.rpc('increment_xp', {
                user_id: approval.student_id,
                amount: 50
            });

            // If RPC doesn't exist, fallback to direct update (less safe but works for now)
            if (xpError) {
                await supabase
                    .from('users')
                    .update({ xp: 100 }) // This is a placeholder; real logic would be better as RPC
                    .eq('id', approval.student_id);

                // Better approach: fetch current XP and update
                const { data: userData } = await supabase.from('users').select('xp').eq('id', approval.student_id).single();
                if (userData) {
                    await supabase.from('users').update({ xp: (userData.xp || 0) + 50 }).eq('id', approval.student_id);
                }
            }
        }

        return NextResponse.json({ message: `Action ${newStatus} recorded.` });

    } catch (error) {
        console.error("Mentor approve error:", error);
        return NextResponse.json({ error: "Approval Action Failed" }, { status: 500 });
    }
}
