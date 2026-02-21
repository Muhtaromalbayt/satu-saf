"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Trophy, User, BookOpen, ShieldCheck, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import { motion } from "framer-motion";

export default function BottomNav() {
    const pathname = usePathname();
    const { user } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const links = [
        { href: "/", label: "Home", icon: Home },
        { href: "/map", label: "Peta", icon: MapIcon },
        { href: "/tadarus", label: "Tadarus", icon: BookOpen },
        { href: "/leaderboard", label: "Ranking", icon: Trophy },
        { href: "/profile", label: "Profil", icon: User },
    ];

    if (mounted && user?.role === 'admin') {
        links.push({ href: "/admin", label: "Admin", icon: ShieldCheck });
    }

    if (!mounted) return null;

    return (
        <nav className="fixed bottom-0 z-50 w-full glass border-t border-white/20 shadow-[0_-4px_30px_rgba(0,0,0,0.06)]">
            <div className="flex h-16 items-center justify-around px-2 pb-safe max-w-lg mx-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "relative flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-2xl transition-all duration-200",
                                isActive
                                    ? "text-primary"
                                    : "text-slate-400 active:text-primary/70"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary/10 rounded-2xl"
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
        </nav>
    );
}
