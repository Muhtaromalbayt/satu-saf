import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isProfilePage = req.nextUrl.pathname === "/register/profile";
    const isLoginPage = req.nextUrl.pathname === "/login";
    const isPublicPage = ["/", "/login"].includes(req.nextUrl.pathname);

    // 1. Redirect to login if not logged in and accessing protected page
    if (!isLoggedIn && !isPublicPage) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // 2. Redirect to profile setup if logged in but profile incomplete (Student/Parent only)
    if (isLoggedIn && !isProfilePage) {
        const user = req.auth?.user as any;
        const isMentor = user?.role === 'mentor';
        const isProfileIncomplete = !user?.isProfileComplete;

        if (!isMentor && isProfileIncomplete) {
            return NextResponse.redirect(new URL("/register/profile", req.url));
        }
    }

    // 3. Protect Mentor routes
    if (req.nextUrl.pathname.startsWith("/mentor")) {
        const user = req.auth?.user as any;
        if (user?.role !== 'mentor') {
            return NextResponse.redirect(new URL("/map", req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|mascot|audio|logo).*)"],
};
