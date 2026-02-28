"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    XCircle,
    MessageCircle,
    Clock,
    ChevronRight,
    Users,
    Star,
    Award
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Child {
    id: string;
    name: string;
    grade?: string;
    todayProgress: {
        count: number;
        verifiedCount: number;
    };
}

export default function ParentMonitor() {
    const [children, setChildren] = useState<Child[]>([]);
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);
    const [childLogs, setChildLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        try {
            const res = await fetch('/api/parent/children');
            const data = await res.json();
            if (data.children) {
                setChildren(data.children);
                if (data.children.length > 0 && !selectedChild) {
                    setSelectedChild(data.children[0]);
                    fetchChildLogs(data.children[0].id);
                }
            }
        } catch (error) {
            console.error("Failed to fetch children", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchChildLogs = async (childId: string) => {
        try {
            const res = await fetch(`/api/habits/log?userId=${childId}`); // Need to adjust GET /api/habits/log to accept userId for parents
            const data = await res.json();
            if (data.logs) {
                setChildLogs(data.logs);
            }
        } catch (error) {
            console.error("Failed to fetch child logs", error);
        }
    };

    const handleVerify = async (logId: string, verified: boolean) => {
        try {
            const res = await fetch('/api/habits/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    logId,
                    verified,
                    parentNote: note[logId] || ''
                })
            });
            if (res.ok) {
                // Update local state
                setChildLogs(prev => prev.map(log =>
                    log.id === logId ? { ...log, verifiedByParent: verified, parentNote: note[logId] } : log
                ));
                // Update child summary
                fetchChildren();
            }
        } catch (error) {
            console.error("Failed to verify habit", error);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-400 font-bold">Memuat data santri...</div>;

    if (children.length === 0) {
        return (
            <div className="bg-white p-8 rounded-[3rem] border-4 border-dashed border-slate-100 text-center space-y-4">
                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                    <Users className="h-10 w-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-400 uppercase">Belum Ada Santri</h3>
                <p className="text-slate-400 text-sm">Pastikan ananda memasukkan email Ayah/Bunda saat pendaftaran profil.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Child Selector */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {children.map((child) => (
                    <button
                        key={child.id}
                        onClick={() => {
                            setSelectedChild(child);
                            fetchChildLogs(child.id);
                        }}
                        className={cn(
                            "flex items-center gap-3 p-3 pr-6 rounded-3xl border-4 transition-all whitespace-nowrap",
                            selectedChild?.id === child.id
                                ? "bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105"
                                : "bg-white border-slate-50 text-slate-400 opacity-60 hover:opacity-100"
                        )}
                    >
                        <div className="h-10 w-10 bg-white/20 rounded-2xl flex items-center justify-center font-black">
                            {child.name[0].toUpperCase()}
                        </div>
                        <div className="text-left">
                            <p className="font-black text-sm uppercase leading-tight">{child.name}</p>
                            <p className={cn("text-[10px] font-bold", selectedChild?.id === child.id ? "text-primary-foreground/60" : "text-slate-300")}>
                                {child.todayProgress.verifiedCount}/{child.todayProgress.count} Verified
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Child Progress Detail */}
            {selectedChild && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border-2 border-slate-50 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" /> AMALAN HARI INI
                            </h3>
                            <div className="bg-slate-50 px-3 py-1 rounded-full text-[10px] font-black text-slate-400">
                                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </div>
                        </div>

                        {childLogs.length === 0 ? (
                            <div className="py-12 text-center text-slate-300 italic">
                                Belum ada amalan yang dicatat oleh ananda hari ini.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {childLogs.map((log) => (
                                    <div key={log.id} className="p-4 bg-slate-50 rounded-3xl space-y-4 border-2 border-transparent hover:border-slate-100 transition-all">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-2xl flex items-center justify-center shadow-sm",
                                                    log.verifiedByParent ? "bg-green-500 text-white" : "bg-white text-primary"
                                                )}>
                                                    {log.verifiedByParent ? <Star className="h-5 w-5 fill-current" /> : <Award className="h-5 w-5" />}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-700 uppercase leading-none mb-1">{log.deedName.replace(/_/g, ' ')}</p>
                                                    <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase italic">
                                                        {log.aspect}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleVerify(log.id, true)}
                                                    className={cn(
                                                        "p-3 rounded-2xl transition-all shadow-sm",
                                                        log.verifiedByParent
                                                            ? "bg-green-500 text-white scale-110"
                                                            : "bg-white text-slate-300 hover:text-green-500 hover:bg-green-50"
                                                    )}
                                                >
                                                    <CheckCircle2 className="h-6 w-6" />
                                                </button>
                                                <button
                                                    onClick={() => handleVerify(log.id, false)}
                                                    className={cn(
                                                        "p-3 rounded-2xl transition-all shadow-sm",
                                                        log.verifiedByParent === false
                                                            ? "bg-rose-500 text-white scale-110"
                                                            : "bg-white text-slate-300 hover:text-rose-500 hover:bg-rose-50"
                                                    )}
                                                >
                                                    <XCircle className="h-6 w-6" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Note Input */}
                                        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl">
                                            <MessageCircle className="h-4 w-4 text-slate-300 ml-2" />
                                            <input
                                                type="text"
                                                value={note[log.id] || log.parentNote || ""}
                                                onChange={(e) => setNote({ ...note, [log.id]: e.target.value })}
                                                placeholder="Berikan apresiasi atau catatan..."
                                                className="flex-1 bg-transparent text-xs font-bold text-slate-700 outline-none"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
