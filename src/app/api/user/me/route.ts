import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/session";

/**
 * GET /api/user/me
 * Returns the current authenticated user.
 */
export async function GET(_req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ user: null }, { status: 401 });
    }
    return NextResponse.json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            kelompok: user.kelompok,
            role: user.role,
        },
    });
}
