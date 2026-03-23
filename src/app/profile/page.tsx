"use client";

import { User, Award, Zap, Flame, Heart, LogOut, ChevronRight, Star, Shield, Users } from "lucide-react";
import { useGamification } from "@/context/GamificationContext";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
    const { streak } = useGamification();
    const { user, signOut } = useAuth();
    const { isMidnight } = useTheme();

    // Role-specific identity builder
    const getRoleLabel = () => {
        if (!user) return 'Santri';
        switch (user.role) {
            case 'parent':
                return `Wali dari Ananda ${user.name?.replace('Wali ', '') || ''}`;
            case 'mentor':
                return `Mentor Kelompok ${user.kelompok || ''}`;
            case 'admin':
                return 'Administrator';
            default:
                return `Santri • ${user.kelompok || ''}`;
        }
    };

    const getRoleBadge = () => {
        switch (user?.role) {
            case 'parent': return { label: 'Orang Tua', color: 'bg-blue-500' };
            case 'mentor': return { label: 'Mentor', color: 'bg-amber-500' };
            case 'admin': return { label: 'Admin', color: 'bg-red-500' };
            default: return { label: 'Santri', color: 'bg-emerald-500' };
        }
    };

    const roleBadge = getRoleBadge();

    return (
        <div className={cn(
            "flex flex-col min-h-screen pb-28 transition-colors duration-1000",
            isMidnight ? "bg-slate-950" : "bg-slate-50"
        )}>
            {/* Gradient Header */}
            <div className={cn(
                "relative px-5 pt-8 pb-16 rounded-b-[2rem] overflow-hidden transition-all duration-1000",
                isMidnight ? "bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 border-b border-indigo-500/20" : "bg-gradient-to-br from-primary via-primary to-emerald-600"
            )}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="absolute top-4 right-4 text-white/10">
                    <Star className="h-28 w-28 fill-current rotate-12" />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={cn(
                            "h-20 w-20 rounded-full border-4 flex items-center justify-center mb-3 shadow-xl transition-colors",
                            isMidnight ? "bg-indigo-500/20 border-indigo-500/40" : "bg-white/20 border-white/40"
                        )}
                    >
                        <User className="h-10 w-10 text-white" />
                    </motion.div>
                    <motion.h1
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl font-black text-white tracking-tight capitalize"
                    >
                        {user?.name || 'Santri'}
                    </motion.h1>
                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.12 }}
                        className="mt-1.5 flex items-center gap-2"
                    >
                        <span className={`text-[9px] font-black text-white uppercase tracking-widest px-2.5 py-0.5 rounded-full ${roleBadge.color}`}>
                            {roleBadge.label}
                        </span>
                    </motion.div>
                    <motion.p
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="text-white/70 text-xs font-bold tracking-wide mt-1"
                    >
                        {getRoleLabel()}
                    </motion.p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="px-4 mt-8 flex justify-center">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className={cn(
                        "p-6 rounded-[2rem] border shadow-xl flex flex-col items-center min-w-[120px] transition-all duration-1000",
                        isMidnight ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
                    )}
                >
                    <div className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center mb-3 transition-colors",
                        isMidnight ? "bg-orange-500/10" : "bg-orange-50"
                    )}>
                        <Flame className="h-8 w-8 text-orange-500 fill-orange-500" />
                    </div>
                    <span className={cn("font-black text-3xl", isMidnight ? "text-white" : "text-slate-800")}>{streak}</span>
                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1 text-center">Hari Konsisten</span>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 mt-5 space-y-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2">Pengaturan</h3>

                <button className={cn(
                    "w-full p-3.5 rounded-xl border flex items-center justify-between active:scale-[0.98] transition-all",
                    isMidnight ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
                )}>
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center",
                            isMidnight ? "bg-blue-500/10" : "bg-blue-50"
                        )}>
                            <User className="h-4 w-4 text-blue-500" />
                        </div>
                        <span className={cn("text-sm font-bold", isMidnight ? "text-slate-300" : "text-slate-700")}>Edit Profil</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                </button>

                <button
                    onClick={() => signOut()}
                    className={cn(
                        "w-full p-3.5 rounded-xl border flex items-center justify-between active:scale-[0.98] transition-all group",
                        isMidnight ? "bg-slate-900 border-red-500/20" : "bg-white border-red-100"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center",
                            isMidnight ? "bg-red-500/10" : "bg-red-50"
                        )}>
                            <LogOut className="h-4 w-4 text-red-500" />
                        </div>
                        <span className="text-sm font-bold text-red-600">Keluar Akun</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-red-400" />
                </button>
            </div>

        </div>
    );
}
