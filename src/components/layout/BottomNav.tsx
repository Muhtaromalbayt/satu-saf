"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, User, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Home", icon: Home },
        { href: "/tadarus", label: "Tadarus", icon: BookOpen },
        { href: "/leaderboard", label: "Ranking", icon: Trophy },
        { href: "/profile", label: "Profil", icon: User },
    ];

    return (
        <nav className="fixed bottom-0 z-50 w-full border-t border-border bg-background pb-safe pt-2">
            <div className="flex h-16 items-center justify-around px-4">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 transition-colors",
                                isActive
                                    ? "text-primary font-bold"
                                    : "text-muted-foreground hover:text-primary/70"
                            )}
                        >
                            <Icon className={cn("h-6 w-6", isActive && "fill-current")} />
                            <span className="text-[10px] uppercase tracking-wide">
                                {link.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
