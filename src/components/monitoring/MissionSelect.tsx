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
                {/* Compact Header */}
                <div className="relative px-4 pt-4 pb-8 bg-emerald-600 rounded-b-[2rem] text-white shadow-[0_10px_30px_rgba(5,150,105,0.25)] overflow-hidden border-b-4 border-emerald-700">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)] pointer-events-none" />
                    <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-[40px] pointer-events-none" />

                    <div className="relative z-10 flex items-center justify-between mb-4">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => { sounds?.play("close"); onClose(); }}
                            className="h-10 w-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all active:scale-90"
                        >
                            <X className="h-5 w-5 text-white" />
                        </motion.button>
                        <div className="bg-amber-400 px-3 py-1.5 rounded-full border-2 border-amber-300 flex items-center gap-1.5 shadow-md">
                            <Trophy className="h-3.5 w-3.5 text-amber-800 fill-amber-800" />
                            <span className="text-[9px] font-black text-amber-900 uppercase tracking-wider leading-none">Misi Spesial</span>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 12 }}
                            className="shrink-0"
                        >
                            <div className="h-16 w-16 bg-white rounded-2xl flex flex-col items-center justify-center border-[3px] border-amber-400 shadow-lg">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tight leading-none">HARI</span>
                                <span className="text-3xl font-black text-emerald-600 leading-none">{day}</span>
                            </div>
                        </motion.div>

                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-black tracking-tight uppercase leading-none mb-2 text-white">Gerbang Taqwa</h2>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">Progress</span>
                                    <span className="text-xs font-black text-amber-300">{Math.round(progress)}%</span>
                                </div>
                                <div className="h-2.5 bg-black/20 rounded-full overflow-hidden p-0.5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Aspect Cards List */}
                <div className="flex-1 overflow-y-auto px-4 -mt-4 pt-2 pb-24">
                    <div className="grid grid-cols-1 gap-3">
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
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: idx * 0.08 }}
                                >
                                    <button
                                        onClick={() => { sounds?.play("open"); onSelectAspect(aspect.id); }}
                                        className={cn(
                                            "w-full bg-white p-3.5 rounded-2xl flex items-center gap-3 border-b-4 transition-all active:scale-[0.98] shadow-md relative overflow-hidden group",
                                            aspectProgress === 100 ? "border-emerald-400" : "border-slate-100"
                                        )}
                                    >
                                        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40 pointer-events-none", colors.gradient)} />

                                        <div className={cn(
                                            "h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border-2 relative overflow-hidden",
                                            colors.lightBg, colors.border, colors.text
                                        )}>
                                            <Icon className={cn("h-6 w-6 fill-current opacity-10 absolute scale-150")} />
                                            <Icon className="h-6 w-6 relative z-10" />
                                        </div>

                                        <div className="flex-1 text-left relative z-10 min-w-0">
                                            <h4 className="font-black text-slate-800 uppercase tracking-tight text-sm leading-none mb-2">{aspect.label}</h4>

                                            <div className="space-y-1">
                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${aspectProgress}%` }}
                                                        className={cn("h-full rounded-full transition-all duration-1000", colors.bg)}
                                                    />
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                                                        {aspectProgress === 100 ? "SELESAI ✨" : `${aspectTasks.length} AMALAN`}
                                                    </span>
                                                    <span className={cn("text-[11px] font-black tabular-nums", colors.dark)}>{Math.round(aspectProgress)}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 shrink-0">
                                            <ChevronRight className="h-4 w-4" />
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
