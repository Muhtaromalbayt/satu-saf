"use client";

import { Heart, Flame, LogOut, User as UserIcon } from "lucide-react";
import { useGamification } from "@/context/GamificationContext";
import { useAuth } from "@/components/providers/AuthProvider";
import { useState, useEffect } from "react";

export default function Header() {
  const { hearts, streak } = useGamification();
  const { user, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-white/20 shadow-sm">
      <div className="flex h-14 max-w-lg items-center justify-between px-4 mx-auto">
        {/* Branding & Profile */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                <UserIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-800 truncate max-w-[90px] leading-tight capitalize">
                  {user.name?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
                <span className="text-[8px] text-primary font-black uppercase tracking-widest leading-none">
                  {user.role || 'Santri'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-base font-bold text-primary tracking-tight leading-tight">SATU SAF</span>
              <span className="text-[9px] text-muted-foreground leading-none">Masjid Nurul Falah</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Streak */}
          <div className="flex items-center gap-1 rounded-xl bg-orange-100/60 px-2.5 py-1 text-orange-600">
            <Flame className="h-3.5 w-3.5 fill-current" />
            <span className="font-bold text-xs">{streak}</span>
          </div>

          {/* Hearts */}
          <div className="flex items-center gap-1 rounded-xl bg-red-100/60 px-2.5 py-1 text-red-600">
            <Heart className="h-3.5 w-3.5 fill-current" />
            <span className="font-bold text-xs">{hearts}</span>
          </div>

          {user && (
            <button
              onClick={() => signOut()}
              className="ml-0.5 p-1.5 bg-slate-100/80 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-all active:scale-90"
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
