import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // BetterAuth handles session via cookies automatically.
    // This middleware can be extended later for route protection.
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
