"use client";

import { useState, useEffect } from "react";
import { Check, X, User, Clock, Camera, MessageSquare, Loader2, Search, Filter, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { sounds } from "@/lib/utils/sounds";

interface PendingItem {
    id: number;
    studentName: string;
    aspect: string;
    deedName: string;
    day: number;
    status: string;
    evidenceUrl?: string;
    reflection?: string;
    capturedAt?: string;
    timestamp: string;
}

export default function MentorDashboard() {
    const [items, setItems] = useState<PendingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<number | null>(null);
    const { isMidnight } = useTheme();

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            const res = await fetch("/api/mentor/pending");
            const data = await res.json();
            setItems(data.items || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id: number, status: 'verified' | 'not_done') => {
        setProcessing(id);
        if (status === 'verified') sounds?.play("success");
        else sounds?.play("close");

        try {
            const res = await fetch("/api/mentor/verify", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });
            if (res.ok) {
                // Optimistic removal
                setItems(prev => prev.filter(item => item.id !== id));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return (
            <div className={cn(
                "min-h-screen flex items-center justify-center transition-colors duration-1000",
                isMidnight ? "bg-slate-950" : "bg-slate-50"
            )}>
                <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className={cn(
            "min-h-screen pb-24 font-sans transition-colors duration-1000",
            isMidnight ? "bg-slate-950" : "bg-slate-50"
        )}>
            {/* Immersive Header */}
            <header className={cn(
                "p-8 pb-10 rounded-b-[3rem] shadow-xl relative overflow-hidden transition-all duration-1000 border-b",
                isMidnight ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
            )}>
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ShieldCheck className="h-32 w-32" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                         <div className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-colors",
                            isMidnight ? "bg-indigo-600 shadow-indigo-600/20" : "bg-emerald-500 shadow-emerald-500/20"
                        )}>
                            <Trophy className="h-6 w-6" />
                        </div>
                        <h1 className={cn("text-3xl font-black tracking-tight uppercase leading-none", isMidnight ? "text-white" : "text-slate-800")}>Review Center</h1>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                        <span className="h-2 w-2 bg-amber-500 rounded-full animate-pulse" />
                        {items.length} Amalan Menunggu Verifikasi
                    </p>
                </div>
            </header>

            <main className="max-w-xl mx-auto p-6 space-y-6 -mt-6">
                <AnimatePresence mode="popLayout">
                    {items.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn(
                                "p-12 rounded-[2.5rem] shadow-xl border text-center space-y-4 transition-all duration-1000",
                                isMidnight ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
                            )}
                        >
                            <div className={cn(
                                "h-20 w-20 rounded-full flex items-center justify-center mx-auto transition-colors",
                                isMidnight ? "bg-emerald-500/10" : "bg-emerald-50"
                            )}>
                                <Check className="h-10 w-10 text-emerald-500" />
                            </div>
                            <h2 className={cn("text-xl font-black uppercase tracking-tight", isMidnight ? "text-white" : "text-slate-800")}>Semua Beres!</h2>
                            <p className="text-slate-400 font-medium text-sm">Tidak ada lagi amalan yang perlu diverifikasi hari ini. Kerja bagus mentor!</p>
                        </motion.div>
                    ) : (
                        items.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                 initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className={cn(
                                    "rounded-[2.5rem] shadow-2xl border overflow-hidden flex flex-col group transition-all duration-1000",
                                    isMidnight ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
                                )}
                            >
                                 {/* Student Info Section */}
                                <div className={cn(
                                    "p-6 flex items-center justify-between border-b transition-colors",
                                    isMidnight ? "border-slate-800" : "border-slate-50"
                                )}>
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "h-14 w-14 border-2 rounded-2xl flex items-center justify-center transition-colors",
                                            isMidnight ? "bg-slate-800 border-slate-700 group-hover:bg-indigo-500/20" : "bg-slate-50 border-slate-100 group-hover:bg-emerald-50"
                                        )}>
                                            <User className={cn("h-7 w-7 transition-colors", isMidnight ? "text-slate-600 group-hover:text-indigo-400" : "text-slate-300 group-hover:text-emerald-500")} />
                                        </div>
                                        <div>
                                            <h3 className={cn("font-black text-lg leading-tight transition-colors", isMidnight ? "text-slate-100" : "text-slate-800")}>{item.studentName}</h3>
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full transition-colors",
                                                isMidnight ? "text-indigo-400 bg-indigo-500/10" : "text-emerald-500 bg-emerald-50"
                                            )}>Hari Ke-{item.day}</span>
                                        </div>
                                    </div>
                                     <div className="text-right">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">ASPEK</span>
                                        <span className={cn("text-xs font-black uppercase tracking-tight", isMidnight ? "text-slate-300" : "text-slate-700")}>{item.aspect.replace('_', ' ')}</span>
                                    </div>
                                </div>

                                 {/* Task Detail Section */}
                                <div className="p-6 space-y-6">
                                    <div className={cn(
                                        "p-5 rounded-3xl border transition-colors",
                                        isMidnight ? "bg-slate-800/50 border-slate-700" : "bg-slate-50/50 border-slate-100"
                                    )}>
                                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                                            <Filter className="h-3 w-3" /> Nama Amalan
                                        </label>
                                        <p className={cn("font-black text-base transition-colors", isMidnight ? "text-white" : "text-slate-800")}>{item.deedName}</p>
                                    </div>

                                    {item.evidenceUrl && (
                                        <div className="space-y-3">
                                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                <Camera className="h-3 w-3" /> Bukti Foto (Live)
                                            </label>
                                            <div className={cn(
                                                "relative rounded-[2rem] overflow-hidden border-4 shadow-lg transition-colors",
                                                isMidnight ? "border-slate-800/50" : "border-slate-50"
                                            )}>
                                                <img src={item.evidenceUrl} alt="Bukti" className="w-full aspect-[4/3] object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-5">
                                                    <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest">
                                                        <Clock className="h-4 w-4 text-emerald-400" />
                                                        {item.capturedAt ? new Date(item.capturedAt).toLocaleString("id-ID") : "No Timestamp"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {item.reflection && (
                                        <div className="space-y-2">
                                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                <MessageSquare className="h-3 w-3" /> Catatan Santri
                                            </label>
                                            <div className={cn(
                                                "p-5 rounded-2xl border italic font-medium text-sm transition-colors",
                                                isMidnight ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-50 border-slate-100 text-slate-600"
                                            )}>
                                                "{item.reflection}"
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="p-6 pt-0 flex gap-4">
                                    <button
                                        disabled={processing === item.id}
                                        onClick={() => handleVerify(item.id, 'not_done')}
                                        className="flex-1 py-5 rounded-2xl border-2 border-rose-100 text-rose-500 font-black uppercase tracking-widest text-[10px] hover:bg-rose-50 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        Tolak
                                    </button>
                                    <button
                                        disabled={processing === item.id}
                                        onClick={() => handleVerify(item.id, 'verified')}
                                        className="flex-[2] py-5 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {processing === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                        Verifikasi Amalan
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

function ShieldCheck({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    );
}
