"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ShieldCheck, Clock, Trophy, Target } from "lucide-react";
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
                className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden"
            >
                {/* Interactive Header */}
                <div className="relative p-10 pb-20 bg-emerald-600 rounded-b-[5rem] text-white shadow-[0_20px_50px_rgba(5,150,105,0.3)] overflow-hidden border-b-[12px] border-emerald-700">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent)] pointer-events-none" />
                    <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                    <div className="relative z-10 flex items-center justify-between mb-10">
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => { sounds?.play("close"); onClose(); }}
                            className="h-16 w-16 bg-white/20 backdrop-blur-2xl rounded-[2.5rem] flex items-center justify-center border-2 border-white/40 hover:bg-white/40 transition-all shadow-2xl active:scale-90"
                        >
                            <X className="h-8 w-8 text-white font-black" />
                        </motion.button>
                        <div className="bg-amber-400 px-6 py-2.5 rounded-full border-4 border-amber-300 flex items-center gap-3 shadow-[0_10px_20px_rgba(251,191,36,0.4)]">
                            <Trophy className="h-5 w-5 text-amber-800 fill-amber-800" />
                            <span className="text-[10px] font-black text-amber-900 uppercase tracking-[0.2em] leading-none">Misi Spesial</span>
                        </div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", damping: 10 }}
                            className="relative mb-8"
                        >
                            <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-150 animate-pulse" />
                            <div className="h-28 w-28 bg-white rounded-[3rem] flex flex-col items-center justify-center border-[6px] border-amber-400 relative z-10 shadow-[0_15px_30px_rgba(0,0,0,0.2)]">
                                <span className="text-[12px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">HARI</span>
                                <span className="text-6xl font-black text-emerald-600 leading-none">{day}</span>
                            </div>
                        </motion.div>

                        <h2 className="text-4xl font-black tracking-tight uppercase leading-none mb-4 drop-shadow-lg text-white">Gerbang Taqwa</h2>

                        <div className="w-full max-w-[280px] space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Total Progress</span>
                                <span className="text-sm font-black text-amber-300">{Math.round(progress)}%</span>
                            </div>
                            <div className="h-5 bg-black/20 rounded-full overflow-hidden border-2 border-white/20 p-1">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.6)]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Aspect Cards List */}
                <div className="flex-1 overflow-y-auto px-6 -mt-10 pt-4 pb-32">
                    <div className="grid grid-cols-1 gap-6">
                        {MONITORING_ASPECTS.map((aspect, idx) => {
                            const aspectTasks = tasks.filter(t => t.aspectId === aspect.id && t.isActive);

                            // If no tasks found for this aspect, try to use hardcoded tasks from MONITORING_ASPECTS constant as a last resort
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

                            const colorMap: Record<string, { bg: string, text: string, shadow: string, border: string, lightBg: string, dark: string, gradient: string }> = {
                                rose: { bg: "bg-rose-500", text: "text-rose-500", shadow: "shadow-rose-500/30", border: "border-rose-100", lightBg: "bg-rose-50", dark: "text-rose-700", gradient: "from-rose-50 to-white" },
                                amber: { bg: "bg-amber-500", text: "text-amber-500", shadow: "shadow-amber-500/30", border: "border-amber-100", lightBg: "bg-amber-50", dark: "text-amber-700", gradient: "from-amber-50 to-white" },
                                emerald: { bg: "bg-emerald-500", text: "text-emerald-500", shadow: "shadow-emerald-500/30", border: "border-emerald-100", lightBg: "bg-emerald-50", dark: "text-emerald-700", gradient: "from-emerald-50 to-white" },
                                indigo: { bg: "bg-indigo-500", text: "text-indigo-500", shadow: "shadow-indigo-500/30", border: "border-indigo-100", lightBg: "bg-indigo-50", dark: "text-indigo-700", gradient: "from-indigo-50 to-white" },
                                violet: { bg: "bg-violet-500", text: "text-violet-500", shadow: "shadow-violet-500/30", border: "border-violet-100", lightBg: "bg-violet-50", dark: "text-violet-700", gradient: "from-violet-50 to-white" },
                            };
                            const colors = colorMap[aspect.color];

                            return (
                                <motion.div
                                    key={aspect.id}
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        y: [0, -6, 0]
                                    }}
                                    transition={{
                                        opacity: { duration: 0.4, delay: idx * 0.1 },
                                        scale: { duration: 0.4, delay: idx * 0.1, type: "spring" },
                                        y: {
                                            repeat: Infinity,
                                            repeatType: "mirror",
                                            duration: 2 + idx * 0.5,
                                            ease: "easeInOut"
                                        }
                                    }}
                                >
                                    <button
                                        onClick={() => { sounds?.play("open"); onSelectAspect(aspect.id); }}
                                        className={cn(
                                            "w-full bg-white p-6 rounded-[3rem] flex items-center gap-6 border-b-[8px] transition-all hover:translate-y-[-4px] active:scale-95 shadow-2xl relative overflow-hidden group",
                                            aspectProgress === 100 ? "border-emerald-500" : "border-slate-200"
                                        )}
                                    >
                                        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50 pointer-events-none", colors.gradient)} />

                                        <div className={cn(
                                            "h-20 w-20 rounded-[2.2rem] flex items-center justify-center transition-all shadow-[inset_0_-4px_10px_rgba(0,0,0,0.05)] border-4 relative overflow-hidden",
                                            colors.lightBg, colors.border, colors.text, "group-hover:scale-110 group-hover:rotate-6"
                                        )}>
                                            <Icon className={cn("h-10 w-10 fill-current opacity-10 absolute scale-150")} />
                                            <Icon className="h-10 w-10 relative z-10 drop-shadow-sm" />
                                        </div>

                                        <div className="flex-1 text-left relative z-10">
                                            <h4 className="font-black text-slate-800 uppercase tracking-tighter text-xl leading-none mb-3">{aspect.label}</h4>

                                            <div className="space-y-2">
                                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-50 p-0.5">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${aspectProgress}%` }}
                                                        className={cn("h-full rounded-full transition-all duration-1000", colors.bg)}
                                                    />
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div className={cn(
                                                        "text-[9px] font-black px-2 py-0.5 rounded-full border",
                                                        aspectProgress === 100
                                                            ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                                                            : "bg-slate-50 border-slate-100 text-slate-400"
                                                    )}>
                                                        {aspectProgress === 100 ? "MISSION COMPLETE" : `${aspectTasks.length} AMALAN`}
                                                    </div>
                                                    <span className={cn("text-xs font-black tabular-nums", colors.dark)}>{Math.round(aspectProgress)}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-14 w-14 rounded-3xl bg-slate-50 border-b-4 border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-600 transition-all shadow-inner">
                                            <ChevronRight className="h-8 w-8" />
                                        </div>
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
