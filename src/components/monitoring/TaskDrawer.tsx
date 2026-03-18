"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Circle, Camera, MessageSquare, ShieldCheck, Clock, Send, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MONITORING_ASPECTS } from "@/lib/constants/monitoring";
import CameraCapture from "./CameraCapture";

interface TaskDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    day: number;
    aspectId: string;
    tasks: any[];
    logs: any[];
    onSave: (taskName: string, data: { status: string, evidenceUrl?: string, reflection?: string, capturedAt?: string }) => Promise<void>;
}

export default function TaskDrawer({ isOpen, onClose, day, aspectId, tasks, logs, onSave }: TaskDrawerProps) {
    const [expandedTask, setExpandedTask] = useState<string | null>(null);
    const [evidenceUrl, setEvidenceUrl] = useState("");
    const [reflection, setReflection] = useState("");
    const [capturedAt, setCapturedAt] = useState("");
    const [showCamera, setShowCamera] = useState(false);
    const [saving, setSaving] = useState(false);

    const aspect = MONITORING_ASPECTS.find(a => a.id === aspectId);
    if (!aspect) return null;

    const getLog = (taskName: string) => logs.find(l => l.deedName === taskName);

    const colorMap: Record<string, { bg: string, border: string, active: string, text: string }> = {
        rose: { bg: "bg-rose-50", border: "border-rose-200", active: "bg-rose-500", text: "text-rose-500" },
        amber: { bg: "bg-amber-50", border: "border-amber-200", active: "bg-amber-500", text: "text-amber-500" },
        emerald: { bg: "bg-emerald-50", border: "border-emerald-200", active: "bg-emerald-500", text: "text-emerald-500" },
        indigo: { bg: "bg-indigo-50", border: "border-indigo-200", active: "bg-indigo-500", text: "text-indigo-500" },
        violet: { bg: "bg-violet-50", border: "border-violet-200", active: "bg-violet-500", text: "text-violet-500" },
    };

    const colors = colorMap[aspect.color] || colorMap.rose;

    const handleExpand = (taskName: string) => {
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
        setEvidenceUrl(base64);
        setCapturedAt(timestamp);
        setShowCamera(false);
    };

    const deletePhoto = () => {
        setEvidenceUrl("");
        setCapturedAt("");
    };

    const handleSave = async (taskName: string) => {
        setSaving(true);
        await onSave(taskName, {
            status: "pending", // Always set to pending when santri submits
            evidenceUrl,
            reflection,
            capturedAt
        });
        setSaving(false);
        setExpandedTask(null);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {showCamera && (
                        <CameraCapture
                            onCapture={handlePhotoCapture}
                            onClose={() => setShowCamera(false)}
                        />
                    )}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
                    />

                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-50 p-6 pb-12 shadow-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />

                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                                    {aspect.label}
                                </h3>
                                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Hari ke-{day} • Live Photo Monitoring</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {tasks.map((taskItem) => {
                                const taskName = taskItem.label;
                                const log = getLog(taskName);
                                const isDone = log?.status === "verified";
                                const isPending = log?.status === "pending";
                                const isExpanded = expandedTask === taskName;

                                return (
                                    <div
                                        key={taskItem.id}
                                        className={cn(
                                            "rounded-[2rem] border-2 transition-all overflow-hidden",
                                            isExpanded ? "border-slate-200 shadow-lg" : "border-slate-50 bg-slate-50/50"
                                        )}
                                    >
                                        <button
                                            onClick={() => handleExpand(taskName)}
                                            className="w-full flex items-center gap-4 p-5 text-left transition-all hover:bg-white"
                                        >
                                            <div className={cn(
                                                "h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all shadow-sm",
                                                isDone ? "bg-emerald-500 text-white" : isPending ? "bg-amber-400 text-white" : "bg-white text-slate-200"
                                            )}>
                                                {isDone ? <ShieldCheck className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                                            </div>
                                            <div className="flex-1">
                                                <span className={cn(
                                                    "font-black text-sm uppercase tracking-tight block",
                                                    isDone || isPending ? "text-slate-800" : "text-slate-400"
                                                )}>
                                                    {taskName}
                                                </span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {isDone ? (
                                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                                            <ShieldCheck className="h-3 w-3" /> Terverifikasi
                                                        </span>
                                                    ) : isPending ? (
                                                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1">
                                                            <Clock className="h-3 w-3" /> Verifikasi Mentor
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Belum dikerjakan</span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>

                                        {isExpanded && (
                                            <div className="p-6 bg-white border-t border-slate-100 space-y-6 animate-in slide-in-from-top-4 duration-300">
                                                <div className="space-y-4">
                                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                                        <Camera className="h-3 w-3" /> Foto Bukti (Wajib Live)
                                                    </label>

                                                    {evidenceUrl ? (
                                                        <div className="relative rounded-3xl overflow-hidden border-4 border-slate-100 shadow-inner group">
                                                            <img src={evidenceUrl} alt="Evidence" className="w-full aspect-[4/3] object-cover" />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                                                                <div className="flex items-center gap-2 text-white text-[10px] font-bold uppercase tracking-widest">
                                                                    <Clock className="h-3 w-3 text-emerald-400" />
                                                                    {capturedAt ? new Date(capturedAt).toLocaleString("id-ID") : "-"}
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={deletePhoto}
                                                                className="absolute top-3 right-3 h-10 w-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-rose-500/80 transition-all opacity-0 group-hover:opacity-100"
                                                            >
                                                                <Trash2 className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setShowCamera(true)}
                                                            className="w-full aspect-[4/3] bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 text-slate-400 hover:bg-slate-100 transition-all group"
                                                        >
                                                            <div className="h-16 w-16 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                <Camera className="h-8 w-8 text-slate-300" />
                                                            </div>
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Ambil Foto Sekarang</span>
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                                        <MessageSquare className="h-3 w-3" /> Pesan untuk Mentor
                                                    </label>
                                                    <textarea
                                                        value={reflection}
                                                        onChange={(e) => setReflection(e.target.value)}
                                                        rows={3}
                                                        placeholder="Sampaikan apa yang kamu pelajari atau kendalamu..."
                                                        className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 outline-none font-bold text-sm transition-all resize-none"
                                                    />
                                                </div>

                                                <button
                                                    onClick={() => handleSave(taskName)}
                                                    disabled={saving || !evidenceUrl || !reflection}
                                                    className={cn(
                                                        "w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-white shadow-lg transition-all active:scale-95 disabled:opacity-50",
                                                        colors.active
                                                    )}
                                                >
                                                    {saving ? "MENYIMPAN..." : "KIRIM KE MENTOR"}
                                                    <Send className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
