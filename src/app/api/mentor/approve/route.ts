export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { requestId, status } = await req.json();
        console.log("Mentor approval by:", session.user.id, { requestId, status });

        return NextResponse.json({ success: true, message: "Approval processed" });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
