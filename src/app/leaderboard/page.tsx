"use client";

import { useState, useEffect } from "react";
import { Trophy, Star, Crown, Loader2, BookOpen, PenLine, Moon } from "lucide-react";
import { motion } from "framer-motion";

interface LeaderboardEntry {
    id: string;
    name: string;
    kelompok: string;
    totalScore: number;
    monitoringDone: number;
    hafalanAvg: number;
    tesTulis: number;
    tahajudCount: number;
}

export default function LeaderboardPage() {
    const [data, setData] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/leaderboard")
            .then(r => r.json())
            .then(d => setData(d.leaderboard || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const top3 = data.slice(0, 3);
    const rest = data.slice(3);

    const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
    const podiumHeights = [80, 110, 65];

    return (
        <div className="flex flex-col items-center min-h-screen bg-slate-50 pb-28">
            {/* Header */}
            <div className="w-full bg-primary p-5 pb-12 text-center rounded-b-[2rem] shadow-xl relative overflow-hidden">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 text-white/20"
                >
                    <Trophy className="h-24 w-24 rotate-12" />
                </motion.div>
                <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">
                    Papan Peringkat
                </h1>
                <p className="text-primary-foreground/80 font-medium text-sm">
                    Skor terbaik dari 14 hari monitoring
                </p>
            </div>

            {/* Podium */}
            <div className="w-full max-w-lg px-4 -mt-6 z-10">
                <div className="bg-white rounded-2xl p-4 shadow-2xl border border-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 to-transparent pointer-events-none" />

                    <div className="flex items-center gap-1.5 mb-4">
                        <Crown className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <h2 className="font-bold text-slate-800 uppercase tracking-widest text-xs">
                            {loading ? "Memuat..." : "Golden Shaf (Top 3)"}
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : data.length === 0 ? (
                        <p className="text-center text-slate-400 text-sm py-6 font-medium">
                            Belum ada data. Selesaikan monitoring dulu!
                        </p>
                    ) : (
                        <div className="flex justify-center items-end gap-3 h-32 px-2">
                            {podiumOrder.map((entry, i) => {
                                if (!entry) return null;
                                const isFirst = i === 1;
                                return (
                                    <div key={entry.id} className="flex-1 flex flex-col items-center gap-2">
                                        <motion.div
                                            initial={{ y: 40, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="relative"
                                        >
                                            <div className={`h-10 w-10 rounded-full border-2 ${isFirst ? "border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]" : "border-slate-100"} bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase overflow-hidden`}>
                                                {entry.name.charAt(0)}
                                            </div>
                                            {isFirst && (
                                                <Star className="absolute -top-3 -right-1.5 h-4 w-4 text-amber-400 fill-amber-400 animate-pulse" />
                                            )}
                                        </motion.div>

                                        <p className="text-[9px] font-bold text-slate-500 text-center leading-tight truncate w-full text-center">
                                            {entry.name.split(" ")[0]}
                                        </p>

                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: podiumHeights[i] }}
                                            className={`w-full rounded-t-lg ${isFirst ? "bg-gradient-to-t from-amber-500 to-amber-300 shadow-lg" : "bg-slate-100"}`}
                                        >
                                            <p className={`text-center text-[10px] font-black mt-2 ${isFirst ? "text-white" : "text-slate-500"}`}>
                                                {entry.totalScore}
                                            </p>
                                        </motion.div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Score Legend */}
            <div className="w-full max-w-lg px-4 mt-4">
                <div className="flex gap-2 text-[10px] text-slate-500 font-bold flex-wrap justify-center">
                    <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-slate-100">
                        <Trophy className="h-3 w-3 text-primary" /> Monitoring (50pt)
                    </span>
                    <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-slate-100">
                        <BookOpen className="h-3 w-3 text-violet-500" /> Hafalan (15pt)
                    </span>
                    <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-slate-100">
                        <PenLine className="h-3 w-3 text-blue-500" /> Tes Tulis (15pt)
                    </span>
                    <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-slate-100">
                        <Moon className="h-3 w-3 text-indigo-500" /> Qiyamullail (20pt)
                    </span>
                </div>
            </div>

            {/* Full List */}
            {!loading && data.length > 0 && (
                <div className="w-full max-w-lg px-4 mt-4 space-y-2">
                    {data.map((entry, i) => (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.04 }}
                            key={entry.id}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${i < 3 ? "bg-white border-amber-100 shadow-sm" : "bg-white/70 border-slate-100"}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`font-black text-base w-6 text-center ${i === 0 ? "text-amber-500" : i <= 2 ? "text-slate-600" : "text-slate-300"}`}>
                                    {i + 1}
                                </span>
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-xs font-black text-primary">
                                    {entry.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-700 text-sm">{entry.name}</h3>
                                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">
                                        {entry.kelompok}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="font-black text-amber-600 text-sm block">{entry.totalScore}</span>
                                <span className="text-[9px] text-muted-foreground font-bold">POIN</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
