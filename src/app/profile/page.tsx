"use client";

import { User, Award, Zap, Flame, Heart, LogOut, ChevronRight, Star } from "lucide-react";
import { useGamification } from "@/context/GamificationContext";
import { useAuth } from "@/components/providers/AuthProvider";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const { xp, hearts, streak } = useGamification();
    const { user, signOut } = useAuth();

    const level = Math.floor(xp / 100) + 1;
    const xpProgress = xp % 100;

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
                    <motion.p
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="text-white/70 text-xs font-bold uppercase tracking-widest mt-0.5"
                    >
                        {user?.role || 'Santri'} • Level {level}
                    </motion.p>
                </div>
            </div>

            {/* Level Progress Card */}
            <div className="px-4 -mt-8 z-10">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-4 shadow-xl border border-slate-100"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Award className="h-4 w-4 text-amber-600" />
                            </div>
                            <div>
                                <span className="text-xs font-black text-slate-800 uppercase tracking-wide">Level {level}</span>
                                <p className="text-[10px] text-slate-400 font-medium">Journey to Taqwa</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-primary">{xpProgress}/100 XP</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${xpProgress}%` }}
                            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Stats Grid */}
            <div className="px-4 mt-4">
                <div className="grid grid-cols-3 gap-3">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center"
                    >
                        <div className="h-10 w-10 bg-orange-50 rounded-xl flex items-center justify-center mb-2">
                            <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
                        </div>
                        <span className="font-black text-lg text-slate-800">{streak}</span>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Streak</span>
                    </motion.div>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center"
                    >
                        <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
                            <Zap className="h-5 w-5 text-primary fill-primary" />
                        </div>
                        <span className="font-black text-lg text-slate-800">{xp}</span>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total XP</span>
                    </motion.div>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center"
                    >
                        <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center mb-2">
                            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                        </div>
                        <span className="font-black text-lg text-slate-800">{hearts}</span>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Nyawa</span>
                    </motion.div>
                </div>
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

            {/* Email info */}
            {user?.email && (
                <div className="px-4 mt-6 text-center">
                    <p className="text-[10px] text-slate-400 font-medium">{user.email}</p>
                </div>
            )}
        </div>
    );
}
