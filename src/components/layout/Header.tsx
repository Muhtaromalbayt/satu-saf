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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-md items-center justify-between px-4">
        {/* Branding & Profile */}
        <div className="flex items-center gap-3 font-geist-sans">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                <UserIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-black text-slate-800 truncate max-w-[100px] leading-tight capitalize">
                  {user.name?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
                <span className="text-[9px] text-primary font-black uppercase tracking-widest leading-none">
                  {user.role || 'Santri'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-primary tracking-tight">SATU SAF</span>
              <span className="text-[10px] text-muted-foreground leading-none">Masjid Nurul Falah</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Streak */}
          <div className="flex items-center gap-1.5 rounded-xl bg-orange-100/50 px-3 py-1.5 text-orange-600">
            <Flame className="h-4 w-4 fill-current" />
            <span className="font-bold text-sm tracking-tight">{streak}</span>
          </div>

          {/* Hearts */}
          <div className="flex items-center gap-1.5 rounded-xl bg-red-100/50 px-3 py-1.5 text-red-600">
            <Heart className="h-4 w-4 fill-current" />
            <span className="font-bold text-sm tracking-tight">{hearts}</span>
          </div>

          {user && (
            <button
              onClick={() => signOut()}
              className="ml-1 p-2 bg-slate-100/80 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all active:scale-95"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
