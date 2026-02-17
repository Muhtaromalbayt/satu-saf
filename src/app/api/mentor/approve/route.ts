// runtime removed for diagnostic

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { approvalId, action, mentorId } = await req.json(); // action: 'approve' | 'reject'

        const db = process.env.DB as any;
        if (!db) return NextResponse.json({ error: "DB not found" }, { status: 500 });

        const newStatus = action === 'approve' ? 'approved' : 'rejected';

        // Update approval status
        await db.prepare(
            `UPDATE approvals SET status = ?, updated_at = ? WHERE id = ? AND mentor_id = ?`
        ).bind(newStatus, Date.now(), approvalId, mentorId).run();

        if (action === 'approve') {
            // If approved, give XP to student
            // First get student_id from approval
            const approval = await db.prepare(`SELECT student_id FROM approvals WHERE id = ?`).bind(approvalId).first();

            if (approval) {
                await db.prepare(
                    `UPDATE users SET xp = xp + 50 WHERE id = ?`
                ).bind(approval.student_id).run();
            }
        }

        return NextResponse.json({ message: `Action ${newStatus} recorded.` });

    } catch (error) {
        return NextResponse.json({ error: "Approval Action Failed" }, { status: 500 });
    }
}
