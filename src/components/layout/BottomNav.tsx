"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { Home, Trophy, User, MessageCircle, ShieldCheck, Map as MapIcon, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

const AUTO_HIDE_DELAY = 3000; // 3 seconds

export default function BottomNav() {
    const pathname = usePathname();
    const { user } = useAuth();
    const { isMidnight } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(true);
    const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Auto-hide logic
    const resetHideTimer = useCallback(() => {
        // Show the nav
        setVisible(true);
        // Clear existing timer
        if (hideTimerRef.current) {
            clearTimeout(hideTimerRef.current);
        }
        // Set new hide timer
        hideTimerRef.current = setTimeout(() => {
            setVisible(false);
        }, AUTO_HIDE_DELAY);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Start initial hide timer
        resetHideTimer();

        // Events that show the nav
        const handleInteraction = () => {
            resetHideTimer();
        };

        // On mobile: touchstart anywhere shows the nav
        // On desktop: mousemove near bottom shows the nav
        window.addEventListener("touchstart", handleInteraction, { passive: true });
        window.addEventListener("scroll", handleInteraction, { passive: true });

        // Desktop: show when mouse is near bottom of screen
        const handleMouseMove = (e: MouseEvent) => {
            const threshold = window.innerHeight - 80;
            if (e.clientY >= threshold) {
                resetHideTimer();
            }
        };
        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        return () => {
            if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
            window.removeEventListener("touchstart", handleInteraction);
            window.removeEventListener("scroll", handleInteraction);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [mounted, resetHideTimer]);

    // Show nav on route change
    useEffect(() => {
        resetHideTimer();
    }, [pathname, resetHideTimer]);

    let links = [
        { href: "/", label: "Home", icon: Home },
        { href: "/map", label: "Peta", icon: MapIcon },
        { href: "/habits", label: "Laporan", icon: MessageCircle },
        { href: "/leaderboard", label: "Ranking", icon: Trophy },
        { href: "/profile", label: "Profil", icon: User },
    ];

    if (mounted) {
        if (user?.role === 'parent') {
            links = [
                { href: "/", label: "Home", icon: Home },
                { href: "/habits", label: "Laporan", icon: MessageCircle },
                { href: "/leaderboard", label: "Ranking", icon: Trophy },
                { href: "/profile", label: "Profil", icon: User },
            ];
        } else if (user?.role === 'mentor') {
            links = [
                { href: "/", label: "Home", icon: Home },
                { href: "/mentor", label: "Verifikator", icon: ShieldCheck },
                { href: "/leaderboard", label: "Ranking", icon: Trophy },
                { href: "/profile", label: "Profil", icon: User },
            ];
        } else if (user?.role === 'santri') {
            links = [
                { href: "/", label: "Home", icon: Home },
                { href: "/map", label: "Peta", icon: MapIcon },
                { href: "/leaderboard", label: "Ranking", icon: Trophy },
                { href: "/profile", label: "Profil", icon: User },
            ];
        }
    }

    if (mounted && user?.role === 'admin') {
        links.push({ href: "/admin", label: "Admin", icon: ShieldCheck });
    }

    if (!mounted) return null;

    return (
        <>
            {/* Tap zone: invisible area at bottom to trigger nav on mobile when hidden */}
            {!visible && (
                <div
                    className="fixed bottom-0 left-0 right-0 h-6 z-40"
                    onTouchStart={() => resetHideTimer()}
                />
            )}
            <motion.nav
                ref={navRef}
                initial={{ y: 0 }}
                animate={{ y: visible ? 0 : 80 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className={cn(
                    "fixed bottom-0 z-50 w-full transition-all duration-1000 border-t backdrop-blur-xl",
                    isMidnight 
                        ? "bg-slate-900/80 border-slate-800 shadow-[0_-4px_30px_rgba(0,0,0,0.5)]" 
                        : "bg-white/80 border-white/20 shadow-[0_-4px_30px_rgba(0,0,0,0.06)]"
                )}
                onMouseEnter={() => resetHideTimer()}
            >
                <div className="flex h-16 items-center justify-around px-2 pb-safe max-w-lg mx-auto">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => resetHideTimer()}
                                className={cn(
                                    "relative flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-2xl transition-all duration-200",
                                    isActive
                                        ? isMidnight ? "text-indigo-400" : "text-primary"
                                        : isMidnight ? "text-slate-600 active:text-indigo-400/70" : "text-slate-400 active:text-primary/70"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className={cn(
                                            "absolute inset-0 rounded-2xl transition-colors",
                                            isMidnight ? "bg-indigo-500/10" : "bg-primary/10"
                                        )}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <Icon className={cn(
                                    "h-5 w-5 relative z-10 transition-transform duration-200",
                                    isActive && "fill-current scale-110"
                                )} />
                                <span className={cn(
                                    "text-[9px] uppercase tracking-wider relative z-10 font-semibold",
                                    isActive && "font-black"
                                )}>
                                    {link.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </motion.nav>
        </>
    );
}
