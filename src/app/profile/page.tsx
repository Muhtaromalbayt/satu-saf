"use client";

import { User, Award, Zap, Flame, Heart, LogOut, ChevronRight, Star, Shield, Users } from "lucide-react";
import { useGamification } from "@/context/GamificationContext";
import { useAuth } from "@/components/providers/AuthProvider";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const { streak } = useGamification();
    const { user, signOut } = useAuth();

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
        <div className="flex flex-col min-h-screen bg-slate-50 pb-28">
            {/* Gradient Header */}
            <div className="relative bg-gradient-to-br from-primary via-primary to-emerald-600 px-5 pt-8 pb-16 rounded-b-[2rem] overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="absolute top-4 right-4 text-white/10">
                    <Star className="h-28 w-28 fill-current rotate-12" />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="h-20 w-20 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center mb-3 shadow-xl"
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
                    className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl flex flex-col items-center min-w-[120px]"
                >
                    <div className="h-14 w-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-3">
                        <Flame className="h-8 w-8 text-orange-500 fill-orange-500" />
                    </div>
                    <span className="font-black text-3xl text-slate-800">{streak}</span>
                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Hari Konsisten</span>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 mt-5 space-y-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2">Pengaturan</h3>

                <button className="w-full bg-white p-3.5 rounded-xl border border-slate-100 flex items-center justify-between active:scale-[0.98] transition-transform">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-500" />
                        </div>
                        <span className="text-sm font-bold text-slate-700">Edit Profil</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                </button>

                <button
                    onClick={() => signOut()}
                    className="w-full bg-white p-3.5 rounded-xl border border-red-100 flex items-center justify-between active:scale-[0.98] transition-transform group"
                >
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-red-50 rounded-lg flex items-center justify-center">
                            <LogOut className="h-4 w-4 text-red-500" />
                        </div>
                        <span className="text-sm font-bold text-red-600">Keluar Akun</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-red-300" />
                </button>
            </div>

        </div>
    );
}
