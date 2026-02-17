import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from 'next/server';

export const runtime = "edge";

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user: mentor } } = await supabase.auth.getUser();

        if (!mentor || mentor.user_metadata?.role !== 'mentor') {
            return NextResponse.json({ error: "Unauthorized: Mentors only" }, { status: 401 });
        }

        const mentorId = mentor.id;

        // Fetch pending approvals with student and lesson info
        const { data, error } = await supabase
            .from('approvals')
            .select(`
                *,
                student:users!student_id(name),
                lesson:lessons!lesson_id(node_type)
            `)
            .eq('mentor_id', mentorId)
            .eq('status', 'pending');

        if (error) {
            console.error("Fetch approvals error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Map results to match expected frontend structure
        const results = data.map(item => ({
            ...item,
            student_name: item.student?.name || 'Anonymous',
            node_type: item.lesson?.node_type || 'story'
        }));

        return NextResponse.json({ approvals: results });

    } catch (error) {
        console.error("Approvals fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch approvals" }, { status: 500 });
    }
}
