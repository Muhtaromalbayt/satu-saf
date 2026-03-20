"use client";

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
    const [missionStartDate, setMissionStartDate] = useState<string>("");

    useEffect(() => {
        const checkMissionStatus = async () => {
            try {
                const res = await fetch("/api/settings");
                const data = await res.json();
                if (data.missionStatus) setMissionStatus(data.missionStatus);
                if (data.missionStartDate) setMissionStartDate(data.missionStartDate);
            } catch (err) {
                console.error("Failed to check mission status", err);
            }
        };
        checkMissionStatus();
    }, []);

    // Date check: Is the mission supposed to start yet?
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = missionStartDate ? new Date(missionStartDate) : null;
    if (startDate) startDate.setHours(0, 0, 0, 0);

    const isBeforeStart = startDate && today < startDate;

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

    // Access control: If mission is closed or hasn't started yet and user is a student, block access
    if (user?.role === "santri") {
        if (missionStatus === "closed") {
            return <MissionClosed />;
        }
        if (isBeforeStart) {
            return (
                <MissionClosed
                    title="Misi Belum Dimulai"
                    message={`Sabar ya! Misi baru akan dimulai pada tanggal ${new Date(missionStartDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}. Siapkan dirimu!`}
                />
            );
        }
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
