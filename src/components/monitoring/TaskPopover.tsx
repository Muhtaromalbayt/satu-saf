"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ShieldCheck, Clock, Heart, User, Globe, Star, BookOpen, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { MONITORING_ASPECTS } from "@/lib/constants/monitoring";

interface TaskPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectAspect: (aspectId: string) => void;
    day: number;
    progress: number;
    position: { x: number, y: number };
    logs: any[];
    tasks: any[];
}

export default function TaskPopover({ isOpen, onClose, onSelectAspect, day, progress, position, logs, tasks }: TaskPopoverProps) {

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop for closing */}
                    <div
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10, x: "-50%" }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, scale: 0.8, y: 10, x: "-50%" }}
                        style={{
                            left: position.x,
                            bottom: `calc(100vh - ${position.y}px + 20px)`
                        }}
                        className="fixed z-50 w-[300px] bg-white rounded-3xl shadow-2xl border-2 border-slate-100 p-5 overflow-hidden ring-8 ring-black/5"
                    >
                        {/* Arrow at bottom */}
                        <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-b-2 border-r-2 border-slate-100 rotate-45" />

                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-50">
                            <div>
                                <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight">
                                    Hari Ke-{day}
                                </h3>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-0.5">
                                    {Math.round(progress)}% SELESAI
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {MONITORING_ASPECTS.map((aspect) => {
                                const aspectTasks = tasks.filter(t => t.aspectId === aspect.id && t.isActive);
                                if (aspectTasks.length === 0) return null;

                                const aspectLogs = logs.filter(l => l.aspect === aspect.id);
                                const doneCount = aspectLogs.filter(l => l.status === "verified").length;
                                const pendingCount = aspectLogs.filter(l => l.status === "pending").length;
                                const aspectProgress = (doneCount / aspectTasks.length) * 100;

                                const Icon = ({
                                    ibadah: Heart,
                                    orang_tua: User,
                                    lingkungan: Globe,
                                    diri_sendiri: Star,
                                    setoran: BookOpen
                                } as any)[aspect.id as string] || LayoutGrid;

                                const colorMap: Record<string, string> = {
                                    rose: "text-rose-500 bg-rose-50",
                                    amber: "text-amber-500 bg-amber-50",
                                    emerald: "text-emerald-500 bg-emerald-50",
                                    indigo: "text-indigo-500 bg-indigo-50",
                                    violet: "text-violet-500 bg-violet-50",
                                };

                                return (
                                    <button
                                        key={aspect.id}
                                        onClick={() => onSelectAspect(aspect.id)}
                                        className="w-full group flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all border-2 border-transparent active:scale-95 active:border-slate-100"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn("p-2 rounded-xl", colorMap[aspect.color])}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-black text-slate-700 text-xs uppercase tracking-tight">
                                                    {aspect.label}
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    {aspectProgress === 100 ? (
                                                        <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 uppercase tracking-widest">
                                                            <ShieldCheck className="h-3 w-3" /> Selesai
                                                        </span>
                                                    ) : pendingCount > 0 ? (
                                                        <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1 uppercase tracking-widest">
                                                            <Clock className="h-3 w-3" /> Pending
                                                        </span>
                                                    ) : (
                                                        <div className="flex gap-1">
                                                            {Array.from({ length: aspectTasks.length }).map((_, i) => (
                                                                <div key={i} className={cn(
                                                                    "w-1 h-1 rounded-full",
                                                                    i < doneCount ? "bg-emerald-400" : "bg-slate-100"
                                                                )} />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
