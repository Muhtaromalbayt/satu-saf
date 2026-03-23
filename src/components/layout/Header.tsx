"use client";

import { Heart, Flame, LogOut, User as UserIcon } from "lucide-react";
import { useGamification } from "@/context/GamificationContext";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function Header() {
  const { hearts, streak } = useGamification();
  const { user, signOut } = useAuth();
  const { isMidnight } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-1000 border-b backdrop-blur-xl",
      isMidnight 
        ? "bg-slate-950/80 border-indigo-500/20 shadow-lg" 
        : "bg-white/80 border-white/20 shadow-sm"
    )}>
      <div className="flex h-14 max-w-lg items-center justify-between px-4 mx-auto">
        {/* Branding & Profile */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-2">
            <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center border shrink-0 transition-colors",
                isMidnight ? "bg-indigo-500/10 border-indigo-500/20" : "bg-primary/10 border-primary/20"
              )}>
                <UserIcon className={cn("h-4 w-4", isMidnight ? "text-indigo-400" : "text-primary")} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className={cn(
                  "text-xs font-bold truncate max-w-[90px] leading-tight capitalize transition-colors",
                  isMidnight ? "text-slate-100" : "text-slate-800"
                )}>
                  {user.name?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-widest leading-none transition-colors",
                  isMidnight ? "text-indigo-400" : "text-primary"
                )}>
                  {user.role || 'Santri'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className={cn("text-base font-bold tracking-tight leading-tight", isMidnight ? "text-white" : "text-primary")}>SATU SAF</span>
              <span className="text-[9px] text-muted-foreground leading-none">Masjid Nurul Falah</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Streak */}
          <div className={cn(
            "flex items-center gap-1 rounded-xl px-2.5 py-1 transition-colors",
            isMidnight ? "bg-orange-500/10 text-orange-400" : "bg-orange-100/60 text-orange-600"
          )}>
            <Flame className="h-3.5 w-3.5 fill-current" />
            <span className="font-bold text-xs">{streak}</span>
          </div>

          {/* Hearts */}
          <div className={cn(
            "flex items-center gap-1 rounded-xl px-2.5 py-1 transition-colors",
            isMidnight ? "bg-red-500/10 text-red-400" : "bg-red-100/60 text-red-600"
          )}>
            <Heart className="h-3.5 w-3.5 fill-current" />
            <span className="font-bold text-xs">{hearts}</span>
          </div>

          {user && (
            <button
              onClick={() => signOut()}
              className={cn(
                "ml-0.5 p-1.5 rounded-lg transition-all active:scale-90",
                isMidnight ? "bg-slate-800 text-slate-500 hover:text-red-400 hover:bg-red-500/10" : "bg-slate-100/80 hover:bg-red-50 text-slate-400 hover:text-red-500"
              )}
              title="Logout"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
