"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ShieldCheck, Clock, Trophy, Target, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { MONITORING_ASPECTS } from "@/lib/constants/monitoring";
import { Heart, User, Globe, Star, BookOpen, LayoutGrid } from "lucide-react";
import { sounds } from "@/lib/utils/sounds";

interface MissionSelectProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectAspect: (aspectId: string) => void;
    day: number;
    progress: number;
    logs: any[];
    tasks: any[];
}

export default function MissionSelect({ isOpen, onClose, onSelectAspect, day, progress, logs, tasks }: MissionSelectProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="fixed inset-0 z-50 bg-gradient-to-b from-slate-50 to-white flex flex-col overflow-hidden"
            >
                {/* ═══ HEADER ═══ */}
                <div className="relative px-5 pt-4 pb-6 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 rounded-b-[2.5rem] text-white overflow-hidden shadow-[0_8px_40px_rgba(5,150,105,0.35)]">
                    {/* Animated mesh background */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-teal-300/15 rounded-full blur-2xl" />
                        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-emerald-300/10 rounded-full blur-xl" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_50%)]" />
                    </div>

                    {/* Top bar: close + badge */}
                    <div className="relative z-10 flex items-center justify-between mb-5">
                        <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => { sounds?.play("close"); onClose(); }}
                            className="h-10 w-10 bg-white/15 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20 hover:bg-white/25 transition-all"
                        >
                            <X className="h-5 w-5 text-white" />
                        </motion.button>
                        <motion.div 
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-1.5 rounded-full border-2 border-amber-300/60 flex items-center gap-2 shadow-lg shadow-amber-500/25"
                        >
                            <Trophy className="h-3.5 w-3.5 text-amber-900 fill-amber-900" />
                            <span className="text-[9px] font-black text-amber-900 uppercase tracking-widest leading-none">Misi Spesial</span>
                        </motion.div>
                    </div>

                    {/* Day badge + title + progress */}
                    <div className="relative z-10 flex items-center gap-4">
                        <motion.div
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", damping: 10, delay: 0.1 }}
                            className="shrink-0 relative"
                        >
                            {/* Glow ring */}
                            <div className="absolute -inset-2 bg-amber-400/20 rounded-2xl blur-lg animate-pulse" />
                            <div className="relative h-18 w-18 bg-white rounded-2xl flex flex-col items-center justify-center border-[3px] border-amber-400 shadow-xl shadow-emerald-900/20" style={{ height: '4.5rem', width: '4.5rem' }}>
                                <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest leading-none">HARI</span>
                                <span className="text-3xl font-black text-emerald-600 leading-none">{day}</span>
                            </div>
                        </motion.div>

                        <div className="flex-1 min-w-0">
                            <motion.h2 
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.15 }}
                                className="text-xl font-black tracking-tight uppercase leading-none mb-1 text-white drop-shadow-sm"
                            >
                                Gerbang Taqwa
                            </motion.h2>
                            <p className="text-[10px] text-emerald-100/70 font-semibold uppercase tracking-widest mb-2.5">Misi Hari Ini</p>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-white/60">Progress</span>
                                    <span className="text-xs font-black text-amber-300 tabular-nums">{Math.round(progress)}%</span>
                                </div>
                                <div className="h-3 bg-black/20 rounded-full overflow-hidden p-[2px] backdrop-blur-sm">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 rounded-full relative overflow-hidden"
                                    >
                                        {/* Shimmer effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite] -translate-x-full" style={{ animation: 'shimmer 2s infinite' }} />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ ASPECT CARDS ═══ */}
                <div className="flex-1 overflow-y-auto px-4 -mt-5 pt-2 pb-28">
                    <div className="flex flex-col gap-3.5">
                        {MONITORING_ASPECTS.map((aspect, idx) => {
                            const aspectTasks = tasks.filter(t => t.aspectId === aspect.id && t.isActive);

                            const tasksToShow = aspectTasks.length > 0 ? aspectTasks : (aspect as any).tasks?.map((label: string, i: number) => ({
                                id: `fallback-${aspect.id}-${i}`,
                                aspectId: aspect.id,
                                label,
                                isActive: true
                            })) || [];

                            if (tasksToShow.length === 0) return null;

                            const aspectLogs = logs.filter(l => l.aspect === aspect.id);
                            const doneCount = aspectLogs.filter(l => l.status === "verified").length;
                            const aspectProgress = tasksToShow.length > 0 ? (doneCount / tasksToShow.length) * 100 : 0;

                            const Icon = ({
                                ibadah: Heart,
                                orang_tua: User,
                                lingkungan: Globe,
                                diri_sendiri: Star,
                                setoran: BookOpen
                            } as any)[aspect.id as string] || LayoutGrid;

                            const colorConfig: Record<string, {
                                bg: string, text: string, border: string, lightBg: string, dark: string,
                                gradient: string, shadow: string, accent: string, glow: string, iconBg: string
                            }> = {
                                rose: { bg: "bg-rose-500", text: "text-rose-500", border: "border-rose-200", lightBg: "bg-rose-50", dark: "text-rose-600", gradient: "from-rose-500 to-pink-500", shadow: "shadow-rose-500/20", accent: "border-l-rose-500", glow: "bg-rose-400/20", iconBg: "bg-gradient-to-br from-rose-50 to-rose-100" },
                                amber: { bg: "bg-amber-500", text: "text-amber-500", border: "border-amber-200", lightBg: "bg-amber-50", dark: "text-amber-600", gradient: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/20", accent: "border-l-amber-500", glow: "bg-amber-400/20", iconBg: "bg-gradient-to-br from-amber-50 to-amber-100" },
                                emerald: { bg: "bg-emerald-500", text: "text-emerald-500", border: "border-emerald-200", lightBg: "bg-emerald-50", dark: "text-emerald-600", gradient: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/20", accent: "border-l-emerald-500", glow: "bg-emerald-400/20", iconBg: "bg-gradient-to-br from-emerald-50 to-emerald-100" },
                                indigo: { bg: "bg-indigo-500", text: "text-indigo-500", border: "border-indigo-200", lightBg: "bg-indigo-50", dark: "text-indigo-600", gradient: "from-indigo-500 to-blue-500", shadow: "shadow-indigo-500/20", accent: "border-l-indigo-500", glow: "bg-indigo-400/20", iconBg: "bg-gradient-to-br from-indigo-50 to-indigo-100" },
                                violet: { bg: "bg-violet-500", text: "text-violet-500", border: "border-violet-200", lightBg: "bg-violet-50", dark: "text-violet-600", gradient: "from-violet-500 to-purple-500", shadow: "shadow-violet-500/20", accent: "border-l-violet-500", glow: "bg-violet-400/20", iconBg: "bg-gradient-to-br from-violet-50 to-violet-100" },
                            };
                            const colors = colorConfig[aspect.color];

                            return (
                                <motion.div
                                    key={aspect.id}
                                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: idx * 0.1,
                                        type: "spring",
                                        damping: 15
                                    }}
                                >
                                    <button
                                        onClick={() => { sounds?.play("open"); onSelectAspect(aspect.id); }}
                                        className={cn(
                                            "w-full bg-white p-4 rounded-2xl flex items-center gap-3.5",
                                            "border border-slate-100/80 border-l-4 transition-all duration-200",
                                            "active:scale-[0.97] active:shadow-sm",
                                            "shadow-lg hover:shadow-xl relative overflow-hidden group",
                                            colors.accent,
                                            aspectProgress === 100 && "ring-2 ring-emerald-400/30"
                                        )}
                                    >
                                        {/* Subtle gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white to-transparent opacity-0 group-active:opacity-60 transition-opacity pointer-events-none" />
                                        
                                        {/* Colored corner glow */}
                                        <div className={cn("absolute -top-4 -left-4 w-16 h-16 rounded-full blur-2xl opacity-30 pointer-events-none", colors.glow)} />

                                        {/* Icon container */}
                                        <div className="relative shrink-0">
                                            <div className={cn(
                                                "h-14 w-14 rounded-2xl flex items-center justify-center border-2 relative overflow-hidden",
                                                colors.iconBg, colors.border, colors.text
                                            )}>
                                                <Icon className="h-6 w-6 fill-current opacity-[0.07] absolute scale-[2]" />
                                                <Icon className="h-7 w-7 relative z-10 drop-shadow-sm" />
                                            </div>
                                            {/* Completion badge */}
                                            {aspectProgress === 100 && (
                                                <motion.div 
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute -top-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-md z-20"
                                                >
                                                    <Sparkles className="h-2.5 w-2.5 text-white" />
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 text-left relative z-10 min-w-0">
                                            <h4 className="font-extrabold text-slate-800 uppercase tracking-tight text-[15px] leading-none mb-2">{aspect.label}</h4>

                                            <div className="space-y-1.5">
                                                {/* Progress bar */}
                                                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${aspectProgress}%` }}
                                                        transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                                                        className={cn("h-full rounded-full bg-gradient-to-r", colors.gradient)}
                                                    />
                                                </div>
                                                {/* Stats row */}
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-1.5">
                                                        <Zap className={cn("h-3 w-3", aspectProgress === 100 ? "text-emerald-500" : "text-slate-300")} />
                                                        <span className={cn(
                                                            "text-[10px] font-bold uppercase tracking-wide",
                                                            aspectProgress === 100 ? "text-emerald-500" : "text-slate-400"
                                                        )}>
                                                            {aspectProgress === 100 ? "SELESAI ✨" : `${aspectTasks.length} AMALAN`}
                                                        </span>
                                                    </div>
                                                    <span className={cn("text-xs font-black tabular-nums", colors.dark)}>{Math.round(aspectProgress)}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <div className={cn(
                                            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200",
                                            "bg-slate-50 text-slate-300 group-active:text-white border border-slate-100",
                                            `group-active:bg-gradient-to-br group-active:${colors.gradient} group-active:border-transparent`
                                        )}>
                                            <ChevronRight className="h-5 w-5 group-active:translate-x-0.5 transition-transform" />
                                        </div>
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Shimmer keyframe CSS */}
                <style jsx>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                `}</style>
            </motion.div>
        </AnimatePresence>
    );
}
