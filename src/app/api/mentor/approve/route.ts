import { NextResponse } from 'next/server';
import { getCurrentUser } from "@/lib/server/session";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { requestId, status } = await req.json();
        console.log("Mentor approval by:", user.id, { requestId, status });

        return NextResponse.json({ success: true, message: "Approval processed" });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
