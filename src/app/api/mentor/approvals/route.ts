import { NextResponse } from 'next/server';
import { getCurrentUser } from "@/lib/server/session";

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // TODO: Fetch real pending approvals from database via Drizzle
        const mockApprovals = [
            {
                id: '1',
                user_id: 'user-1',
                lesson_id: 'ch1-action-1',
                status: 'pending',
                users: { name: 'Santri Ahmad' },
                lessons: { title: 'Misi Sedekah' }
            }
        ];
        return NextResponse.json(mockApprovals);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
