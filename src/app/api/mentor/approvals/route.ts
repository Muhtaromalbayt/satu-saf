// runtime removed for diagnostic

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        // In real app, verify mentor session here
        // const session = await auth();
        // const mentorId = session.user.id;
        const mentorId = req.nextUrl.searchParams.get('mentor_id'); // Mock for now

        const db = process.env.DB as any;

        if (!db) {
            return NextResponse.json({ error: "Database binding not found" }, { status: 500 });
        }

        // specific group's pending approvals
        const results = await db.prepare(
            `SELECT a.*, u.name as student_name, l.node_type 
       FROM approvals a
       JOIN users u ON a.student_id = u.id
       JOIN lessons l ON a.lesson_id = l.id
       WHERE a.mentor_id = ? AND a.status = 'pending'`
        ).bind(mentorId).all();

        return NextResponse.json({ approvals: results.results });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch approvals" }, { status: 500 });
    }
}
