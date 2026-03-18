"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, MessageSquare, Send, ShieldCheck, Clock, Trash2, ArrowLeft, ChevronRight, Trophy } from "lucide-react";
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
}

export default function TaskMission({ isOpen, onClose, day, aspectId, tasks, logs, onSave }: TaskMissionProps) {
    const [expandedTask, setExpandedTask] = useState<string | null>(null);
    const [evidenceUrl, setEvidenceUrl] = useState("");
    const [reflection, setReflection] = useState("");
    const [capturedAt, setCapturedAt] = useState("");
    const [showCamera, setShowCamera] = useState(false);
    const [saving, setSaving] = useState(false);

    const aspect = MONITORING_ASPECTS.find(a => a.id === aspectId);
    if (!aspect) return null;

    const getLog = (taskName: string) => logs.find(l => l.deedName === taskName);

    const colorMap: Record<string, { bg: string, accent: string, text: string, gradient: string }> = {
        rose: { bg: "bg-rose-500", accent: "bg-rose-400", text: "text-rose-500", gradient: "from-rose-500 to-rose-600" },
        amber: { bg: "bg-amber-500", accent: "bg-amber-400", text: "text-amber-500", gradient: "from-amber-500 to-amber-600" },
        emerald: { bg: "bg-emerald-500", accent: "bg-emerald-400", text: "text-emerald-500", gradient: "from-emerald-500 to-emerald-600" },
        indigo: { bg: "bg-indigo-500", accent: "bg-indigo-400", text: "text-indigo-500", gradient: "from-indigo-500 to-indigo-600" },
        violet: { bg: "bg-violet-500", accent: "bg-violet-400", text: "text-violet-500", gradient: "from-violet-500 to-violet-600" },
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

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    className="fixed inset-0 z-50 bg-slate-50 flex flex-col"
                >
                    {showCamera && (
                        <CameraCapture
                            onCapture={handlePhotoCapture}
                            onClose={() => setShowCamera(false)}
                        />
                    )}

                    {/* Immersive Header */}
                    <div className={cn("relative p-10 pb-20 rounded-b-[5rem] text-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border-b-[12px]", colors.bg, "border-black/20")}>
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
                                <ArrowLeft className="h-8 w-8 text-white font-black" />
                            </motion.button>
                            <div className="bg-amber-400 px-6 py-2.5 rounded-full border-4 border-amber-300 flex items-center gap-3 shadow-[0_10px_20px_rgba(251,191,36,0.4)]">
                                <Trophy className="h-5 w-5 text-amber-800 fill-amber-800" />
                                <span className="text-[10px] font-black text-amber-900 uppercase tracking-[0.2em] leading-none">Misi Hari {day}</span>
                            </div>
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <h2 className="text-4xl font-black tracking-tight uppercase leading-none mb-4 drop-shadow-lg drop-shadow-emerald-900/50">{aspect.label}</h2>
                            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                                <ShieldCheck className="h-4 w-4 text-amber-300" />
                                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-white">Target Kejujuran & Kedisplinan</p>
                            </div>
                        </div>
                    </div>

                    {/* Task List Section */}
                    <div className="flex-1 overflow-y-auto px-6 -mt-8 pb-32">
                        <div className="space-y-4">
                            {tasks.map((taskItem, idx) => {
                                const taskName = taskItem.label;
                                const log = getLog(taskName);
                                const isDone = log?.status === "verified";
                                const isPending = log?.status === "pending";
                                const isExpanded = expandedTask === taskName;

                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1, type: "spring", damping: 15 }}
                                        className={cn(
                                            "rounded-[3rem] transition-all border-b-[8px] overflow-hidden shadow-2xl",
                                            isExpanded ? "bg-white border-slate-300 translate-y-[-4px]" : "bg-white border-slate-200"
                                        )}
                                    >
                                        <button
                                            onClick={() => handleExpand(taskName)}
                                            className="w-full flex items-center gap-6 p-6 text-left active:scale-98 transition-transform relative overflow-hidden"
                                        >
                                            <div className={cn(
                                                "h-16 w-16 rounded-[1.8rem] flex items-center justify-center flex-shrink-0 transition-all shadow-[inset_0_-4px_8px_rgba(0,0,0,0.05)] border-2 relative overflow-hidden",
                                                isDone
                                                    ? "bg-emerald-500 text-white border-emerald-400"
                                                    : isPending
                                                        ? "bg-amber-500 text-white border-amber-400 shadow-[0_10px_20px_rgba(245,158,11,0.2)]"
                                                        : "bg-slate-50 text-slate-300 border-slate-200"
                                            )}>
                                                {isDone ? (
                                                    <ShieldCheck className="h-10 w-10 text-white drop-shadow-sm" />
                                                ) : isPending ? (
                                                    <Clock className="h-9 w-9 text-white animate-pulse" />
                                                ) : (
                                                    <div className="h-7 w-7 rounded-full border-[6px] border-slate-200 border-t-slate-300 opacity-50" />
                                                )}
                                            </div>
                                            <div className="flex-1 relative z-10">
                                                <h4 className={cn(
                                                    "font-black text-base uppercase tracking-tight leading-none mb-2",
                                                    isDone || isPending ? "text-slate-800" : "text-slate-400"
                                                )}>
                                                    {taskName}
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    {isDone ? (
                                                        <div className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100">
                                                            Poin Didapat +10
                                                        </div>
                                                    ) : isPending ? (
                                                        <div className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-50 text-amber-500 border border-amber-100">
                                                            Menunggu Verifikasi
                                                        </div>
                                                    ) : (
                                                        <div className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-50 text-slate-400 border border-slate-100">
                                                            Tugas Wajib
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {!isDone && !isPending && (
                                                <motion.div
                                                    animate={isExpanded ? { rotate: 90, scale: 1.2 } : { rotate: 0, scale: 1 }}
                                                    className="h-12 w-12 rounded-[1.2rem] bg-slate-50 flex items-center justify-center text-slate-400 border-b-2 border-slate-200"
                                                >
                                                    <ChevronRight className="h-7 w-7" />
                                                </motion.div>
                                            )}
                                        </button>

                                        <AnimatePresence>
                                            {isExpanded && !isDone && !isPending && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="px-6 pb-6 space-y-6 overflow-hidden"
                                                >
                                                    <div className="h-px bg-slate-100 w-full" />

                                                    {/* Evidence Preview */}
                                                    <div className="grid grid-cols-1 gap-4">
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                                    <Camera className="h-3 w-3" /> Bukti Foto Terkini
                                                                </label>
                                                                {evidenceUrl && (
                                                                    <button onClick={() => setEvidenceUrl("")} className="text-[9px] font-black text-rose-500 flex items-center gap-1 uppercase tracking-widest">
                                                                        <Trash2 className="h-3 w-3" /> Hapus
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {evidenceUrl ? (
                                                                <div className="relative rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl flex items-center justify-center bg-slate-100">
                                                                    <img src={evidenceUrl} alt="Bukti" className="w-full aspect-video object-cover" />
                                                                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 text-[8px] font-black text-white uppercase tracking-widest">
                                                                        <Clock className="h-3 w-3 text-emerald-400" />
                                                                        {capturedAt ? new Date(capturedAt).toLocaleTimeString("id-ID") : "-"}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => { sounds?.play("click"); setShowCamera(true); }}
                                                                    className="w-full aspect-video bg-slate-50 rounded-[2rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group active:scale-95"
                                                                >
                                                                    <div className="h-16 w-16 rounded-3xl bg-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                                                        <Camera className="h-8 w-8 text-emerald-500" />
                                                                    </div>
                                                                    <span className="text-[10px] font-black uppercase tracking-widest">Buka Kamera Misi</span>
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Reflection Input */}
                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                                <MessageSquare className="h-3 w-3" /> Catatan Kejujuran
                                                            </label>
                                                            <textarea
                                                                value={reflection}
                                                                onChange={(e) => setReflection(e.target.value)}
                                                                rows={3}
                                                                placeholder="Tuliskan pengalamanmu hari ini..."
                                                                className="w-full p-5 rounded-[2rem] bg-slate-50 border-2 border-slate-100 focus:border-emerald-500 focus:bg-white outline-none font-bold text-sm transition-all resize-none shadow-inner text-slate-700"
                                                            />
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => handleSave(taskName)}
                                                        disabled={saving || !evidenceUrl || !reflection}
                                                        className={cn(
                                                            "w-full py-5 rounded-[2rem] flex items-center justify-center gap-3 font-black text-white shadow-2xl transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs",
                                                            colors.bg, "shadow-current/20"
                                                        )}
                                                    >
                                                        {saving ? "MENYIMPAN DATA..." : "LAPORKAN MISI SELESAI"}
                                                        <Send className="h-4 w-4" />
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
