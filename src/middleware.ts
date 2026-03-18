import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/lib/server/session-constants'

const PROTECTED_ROUTES = ['/map', '/mentor', '/admin', '/leaderboard', '/habits', '/profile', '/tadarus', '/parent']
const AUTH_ROUTES = ['/login']

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get(SESSION_COOKIE)?.value

    const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r))
    const isAuthRoute = AUTH_ROUTES.some(r => pathname.startsWith(r))

    // Redirect unauthenticated users away from protected routes
    if (isProtected && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirect authenticated users away from login
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/map', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
