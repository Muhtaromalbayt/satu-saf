import { NextResponse } from "next/server";

/**
 * Old BetterAuth catch-all handler — now replaced by sheets-login system.
 * This stub prevents 404 errors on old routes.
 */
export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({ error: "Auth endpoint deprecated. Use /api/auth/sheets-login" }, { status: 410 });
}

export async function POST() {
    return NextResponse.json({ error: "Auth endpoint deprecated. Use /api/auth/sheets-login" }, { status: 410 });
}
