"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, MessageSquare, Send, ShieldCheck, Clock, Trash2, ArrowLeft, ChevronRight, Trophy, Zap, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MONITORING_ASPECTS } from "@/lib/constants/monitoring";
import CameraCapture from "./CameraCapture";
import { sounds } from "@/lib/utils/sounds";

interface TaskMissionProps {
    isOpen: boolean;
    onClose: () => void;
    day: number;
    aspectId: string;
    tasks: any[];
    logs: any[];
    onSave: (taskName: string, data: { status: string, evidenceUrl?: string, reflection?: string, capturedAt?: string }) => Promise<void>;
    isMidnight?: boolean;
}

export default function TaskMission({ isOpen, onClose, day, aspectId, tasks, logs, onSave, isMidnight }: TaskMissionProps) {
    const [expandedTask, setExpandedTask] = useState<string | null>(null);
    const [evidenceUrl, setEvidenceUrl] = useState("");
    const [reflection, setReflection] = useState("");
    const [capturedAt, setCapturedAt] = useState("");
    const [showCamera, setShowCamera] = useState(false);
    const [saving, setSaving] = useState(false);

    const aspect = MONITORING_ASPECTS.find(a => a.id === aspectId);
    if (!aspect) return null;

    const getLog = (taskName: string) => logs.find(l => l.deedName === taskName);

    const colorMap: Record<string, { bg: string, accent: string, text: string, gradient: string, light: string, border: string }> = {
        rose: { bg: "bg-rose-500", accent: "bg-rose-400", text: "text-rose-500", gradient: "from-rose-500 via-pink-500 to-rose-600", light: "bg-rose-50", border: "border-rose-200" },
        amber: { bg: "bg-amber-500", accent: "bg-amber-400", text: "text-amber-500", gradient: "from-amber-500 via-orange-400 to-amber-600", light: "bg-amber-50", border: "border-amber-200" },
        emerald: { bg: "bg-emerald-500", accent: "bg-emerald-400", text: "text-emerald-500", gradient: "from-emerald-500 via-teal-400 to-emerald-600", light: "bg-emerald-50", border: "border-emerald-200" },
        indigo: { bg: "bg-indigo-500", accent: "bg-indigo-400", text: "text-indigo-500", gradient: "from-indigo-500 via-blue-400 to-indigo-600", light: "bg-indigo-50", border: "border-indigo-200" },
        violet: { bg: "bg-violet-500", accent: "bg-violet-400", text: "text-violet-500", gradient: "from-violet-500 via-purple-400 to-violet-600", light: "bg-violet-50", border: "border-violet-200" },
    };

    const colors = colorMap[aspect.color] || colorMap.rose;

    const handleExpand = (taskName: string) => {
        sounds?.play("click");
        if (expandedTask === taskName) {
            setExpandedTask(null);
        } else {
            const log = getLog(taskName);
            setExpandedTask(taskName);
            setEvidenceUrl(log?.evidenceUrl || "");
            setReflection(log?.reflection || "");
            setCapturedAt(log?.capturedAt || "");
        }
    };

    const handlePhotoCapture = (base64: string, timestamp: string) => {
        sounds?.play("camera");
        setEvidenceUrl(base64);
        setCapturedAt(timestamp);
        setShowCamera(false);
    };

    const handleSave = async (taskName: string) => {
        setSaving(true);
        await onSave(taskName, {
            status: "pending",
            evidenceUrl,
            reflection,
            capturedAt
        });
        sounds?.play("success");
        setSaving(false);
        setExpandedTask(null);
    };

    const doneCount = tasks.filter(t => {
        const log = getLog(t.label);
        return log?.status === "verified" || log?.status === "pending";
    }).length;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    className={cn(
                        "fixed inset-0 z-50 flex flex-col transition-colors duration-1000",
                        isMidnight ? "bg-slate-950" : "bg-slate-50"
                    )}
                >
                    {showCamera && (
                        <CameraCapture
                            onCapture={handlePhotoCapture}
                            onClose={() => setShowCamera(false)}
                        />
                    )}

                    {/* ═══ COMPACT HEADER ═══ */}
                    <div className={cn(
                        "relative px-4 pt-4 pb-5 rounded-b-[2rem] text-white overflow-hidden shadow-lg transition-colors duration-1000",
                        isMidnight 
                            ? "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 shadow-indigo-500/10" 
                            : `bg-gradient-to-br ${colors.gradient}`
                    )}>
                        {/* Decorative elements */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/10 to-transparent" />
                        </div>

                        {/* Top bar */}
                        <div className="relative z-10 flex items-center gap-3 mb-3">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => { sounds?.play("close"); onClose(); }}
                                className="h-9 w-9 bg-white/15 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20 active:bg-white/25 transition-all shrink-0"
                            >
                                <ArrowLeft className="h-4.5 w-4.5 text-white" />
                            </motion.button>

                            <div className="flex-1 min-w-0">
                                <motion.h2
                                    initial={{ y: 8, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="text-lg font-black tracking-tight uppercase leading-none text-white truncate"
                                >
                                    {aspect.label}
                                </motion.h2>
                            </div>

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 flex items-center gap-1.5 shrink-0"
                            >
                                <Trophy className="h-3 w-3 text-amber-300 fill-amber-300" />
                                <span className="text-[9px] font-black uppercase tracking-wider leading-none">Hari {day}</span>
                            </motion.div>
                        </div>

                        {/* Progress strip */}
                        <div className="relative z-10 flex items-center gap-3">
                            <div className="flex-1 h-2 bg-black/20 rounded-full overflow-hidden p-[1px]">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${tasks.length > 0 ? (doneCount / tasks.length) * 100 : 0}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-white/80 to-white/60 rounded-full"
                                />
                            </div>
                            <span className="text-[10px] font-black text-white/80 tabular-nums shrink-0">{doneCount}/{tasks.length}</span>
                        </div>
                    </div>

                    {/* ═══ TASK LIST ═══ */}
                    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28">
                        <div className="space-y-3">
                            {tasks.map((taskItem, idx) => {
                                const taskName = taskItem.label;
                                const log = getLog(taskName);
                                const isDone = log?.status === "verified";
                                const isPending = log?.status === "pending";
                                const isExpanded = expandedTask === taskName;

                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.08, type: "spring", damping: 18 }}
                                        className={cn(
                                            "rounded-2xl transition-all overflow-hidden border",
                                            isExpanded
                                                ? isMidnight ? "bg-slate-900 border-slate-800 shadow-xl shadow-black/40" : "bg-white shadow-xl border-slate-200 ring-1 ring-slate-100"
                                                : isMidnight ? "bg-slate-900/50 border-slate-800" : "bg-white shadow-md border-slate-100 active:scale-[0.98]"
                                        )}
                                    >
                                        <button
                                            onClick={() => handleExpand(taskName)}
                                            className="w-full flex items-center gap-3.5 p-4 text-left transition-all relative"
                                        >
                                            {/* Status icon */}
                                            <div className={cn(
                                                "h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-all border-2",
                                                isDone
                                                    ? "bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/20"
                                                    : isPending
                                                        ? "bg-amber-500 text-white border-amber-400 shadow-md shadow-amber-500/20"
                                                        : isMidnight ? "bg-slate-800 text-slate-600 border-slate-700" : "bg-slate-50 text-slate-300 border-slate-200"
                                            )}>
                                                {isDone ? (
                                                    <CheckCircle2 className="h-6 w-6 text-white" />
                                                ) : isPending ? (
                                                    <Clock className="h-5 w-5 text-white animate-pulse" />
                                                ) : (
                                                    <div className="h-5 w-5 rounded-full border-[3px] border-slate-200" />
                                                )}
                                            </div>

                                            {/* Label + status */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className={cn(
                                                    "font-extrabold text-sm uppercase tracking-tight leading-none mb-1.5",
                                                    isDone || isPending 
                                                        ? isMidnight ? "text-slate-200" : "text-slate-800" 
                                                        : isMidnight ? "text-slate-500" : "text-slate-500"
                                                )}>
                                                    {taskName}
                                                </h4>
                                                <span className={cn(
                                                    "text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1 px-2 py-0.5 rounded-md",
                                                    isDone
                                                        ? "bg-emerald-50 text-emerald-600"
                                                        : isPending
                                                            ? "bg-amber-50 text-amber-600"
                                                            : isMidnight ? "bg-slate-800 text-slate-500" : "bg-slate-50 text-slate-400"
                                                )}>
                                                    {isDone ? (
                                                        <><Zap className="h-2.5 w-2.5" /> Poin +10</>
                                                    ) : isPending ? (
                                                        <><Clock className="h-2.5 w-2.5" /> Menunggu Verifikasi</>
                                                    ) : (
                                                        "Tugas Wajib"
                                                    )}
                                                </span>
                                            </div>

                                            {/* Chevron */}
                                            {!isDone && !isPending && (
                                                <motion.div
                                                    animate={isExpanded ? { rotate: 90 } : { rotate: 0 }}
                                                    className={cn(
                                                        "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border",
                                                        isMidnight ? "bg-slate-800 text-slate-500 border-slate-700" : "bg-slate-50 text-slate-400 border-slate-100"
                                                    )}
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </motion.div>
                                            )}
                                        </button>

                                        {/* ═══ EXPANDED FORM ═══ */}
                                        <AnimatePresence>
                                            {isExpanded && !isDone && !isPending && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="px-4 pb-4 space-y-4 overflow-hidden"
                                                >
                                                    <div className={cn("h-px w-full", isMidnight ? "bg-slate-800" : "bg-slate-100")} />

                                                    {/* Photo evidence */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                                                <Camera className="h-3 w-3" /> Bukti Foto
                                                            </label>
                                                            {evidenceUrl && (
                                                                <button onClick={() => setEvidenceUrl("")} className={cn("text-[9px] font-bold flex items-center gap-1 uppercase tracking-wider", isMidnight ? "text-rose-400 hover:text-rose-300" : "text-rose-500 hover:text-rose-600")}>
                                                                    <Trash2 className="h-2.5 w-2.5" /> Hapus
                                                                </button>
                                                            )}
                                                        </div>

                                                        {evidenceUrl ? (
                                                            <div className={cn("relative rounded-xl overflow-hidden border-2 shadow-sm", isMidnight ? "border-slate-800" : "border-slate-100")}>
                                                                <img src={evidenceUrl} alt="Bukti" className="w-full aspect-video object-cover" />
                                                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[8px] font-bold text-white uppercase tracking-wider">
                                                                    <Clock className="h-2.5 w-2.5 text-emerald-400" />
                                                                    {capturedAt ? new Date(capturedAt).toLocaleTimeString("id-ID") : "-"}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => { sounds?.play("click"); setShowCamera(true); }}
                                                                className={cn(
                                                                    "w-full aspect-[2/1] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all group active:scale-[0.98]",
                                                                    isMidnight 
                                                                        ? "bg-slate-900 border-slate-700 text-slate-600 hover:border-indigo-500 hover:bg-indigo-500/5" 
                                                                        : "bg-slate-50 border-slate-200 text-slate-400 hover:border-emerald-300 hover:bg-emerald-50/50"
                                                                )}
                                                            >
                                                                <div className={cn(
                                                                    "h-10 w-10 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform",
                                                                    isMidnight ? "bg-slate-800" : "bg-white"
                                                                )}>
                                                                    <Camera className={cn("h-5 w-5", isMidnight ? "text-indigo-400" : "text-emerald-500")} />
                                                                </div>
                                                                <span className="text-[10px] font-bold uppercase tracking-wider">Buka Kamera</span>
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Reflection */}
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                                            <MessageSquare className="h-3 w-3" /> Catatan
                                                        </label>
                                                        <textarea
                                                            value={reflection}
                                                            onChange={(e) => setReflection(e.target.value)}
                                                            rows={2}
                                                            placeholder="Tuliskan pengalamanmu..."
                                                            className={cn(
                                                                "w-full p-3.5 rounded-xl border outline-none font-semibold text-sm transition-all resize-none",
                                                                isMidnight 
                                                                    ? "bg-slate-900 border-slate-800 text-slate-200 focus:border-indigo-500 placeholder:text-slate-700" 
                                                                    : "bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-300 focus:border-emerald-400 focus:bg-white"
                                                            )}
                                                        />
                                                    </div>

                                                    {/* Submit button */}
                                                    <button
                                                        onClick={() => handleSave(taskName)}
                                                        disabled={saving || !evidenceUrl || !reflection}
                                                        className={cn(
                                                            "w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-white shadow-lg transition-all active:scale-[0.97] disabled:opacity-40 uppercase tracking-wider text-xs",
                                                            `bg-gradient-to-r ${colors.gradient}`
                                                        )}
                                                    >
                                                        {saving ? "MENYIMPAN..." : "LAPORKAN MISI"}
                                                        <Send className="h-3.5 w-3.5" />
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
