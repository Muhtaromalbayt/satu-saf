"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import BottomNav from "./BottomNav";
import { useAuth } from "@/components/providers/AuthProvider";

interface AppShellProps {
    children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
    const pathname = usePathname();
    const { user } = useAuth();

    // Define patterns where we DON'T want the global Header and BottomNav
    const isLandingPage = pathname === "/";
    const isLoginPage = pathname === "/login";
    const isAdminPage = pathname.startsWith("/admin");
    const isAuthPage = pathname.startsWith("/auth") || pathname.startsWith("/register");

    // Hide UI on landing ONLY if NOT logged in
    const hideGlobalUI = (isLandingPage && !user) || isLoginPage || isAdminPage || isAuthPage;

    if (hideGlobalUI) {
        return <>{children}</>;
    }

    return (
        <div className="relative flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pb-24">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
