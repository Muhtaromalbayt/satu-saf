import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import BottomNav from "./BottomNav";
import MissionClosed from "./MissionClosed";
import { useAuth } from "@/components/providers/AuthProvider";

interface AppShellProps {
    children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
    const pathname = usePathname();
    const { user } = useAuth();
    const [missionStatus, setMissionStatus] = useState<string>("open");

    useEffect(() => {
        const checkMissionStatus = async () => {
            try {
                const res = await fetch("/api/settings");
                const data = await res.json();
                if (data.missionStatus) {
                    setMissionStatus(data.missionStatus);
                }
            } catch (err) {
                console.error("Failed to check mission status", err);
            }
        };
        checkMissionStatus();
    }, []);

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

    // Access control: If mission is closed and user is a student, block access
    if (missionStatus === "closed" && user?.role === "santri") {
        return <MissionClosed />;
    }

    return (
        <div className="relative flex min-h-screen flex-col bg-background text-foreground">
            <Header />
            <main className="flex-1 pb-24">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
