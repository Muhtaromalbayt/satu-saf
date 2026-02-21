"use client";

import { Trophy, Star, Crown } from "lucide-react";
import { motion } from "framer-motion";

export default function LeaderboardPage() {
    return (
        <div className="flex flex-col items-center min-h-screen bg-slate-50 pb-28">
            {/* Header Area */}
            <div className="w-full bg-primary p-5 pb-10 text-center rounded-b-[2rem] shadow-xl relative overflow-hidden">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 text-white/20"
                >
                    <Trophy className="h-24 w-24 rotate-12" />
                </motion.div>

                <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">Papan Peringkat</h1>
                <p className="text-primary-foreground/80 font-medium text-sm">Bina Taqwamu, Raih Shaf Terdepan!</p>
            </div>

            {/* Golden Shaf Visualization */}
            <div className="w-full max-w-lg px-4 -mt-6 z-10">
                <div className="bg-white rounded-2xl p-4 shadow-2xl border border-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 to-transparent pointer-events-none" />

                    <div className="flex items-center gap-1.5 mb-4">
                        <Crown className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <h2 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Golden Shaf (Top 5)</h2>
                    </div>

                    <div className="flex justify-between items-end gap-1.5 h-32">
                        {[2, 0, 1, 3, 4].map((idx, i) => {
                            const rank = idx + 1;
                            const heightFactor = [0.7, 0.6, 1, 0.5, 0.4][i];
                            const isFirst = rank === 1;

                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                    <motion.div
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="relative group"
                                    >
                                        <div className={`h-10 w-10 rounded-full border-3 ${isFirst ? 'border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]' : 'border-slate-100'} bg-slate-200 overflow-hidden`}>
                                            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase">
                                                S{rank}
                                            </div>
                                        </div>
                                        {isFirst && (
                                            <Star className="absolute -top-3 -right-1.5 h-4 w-4 text-amber-400 fill-amber-400 animate-pulse" />
                                        )}
                                    </motion.div>

                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: heightFactor * 80 }}
                                        className={`w-full rounded-t-lg transition-all ${isFirst ? 'bg-gradient-to-t from-amber-500 to-amber-300 shadow-lg' : 'bg-slate-100'}`}
                                    />
                                    <span className={`text-[9px] font-black ${isFirst ? 'text-amber-600' : 'text-slate-400'}`}>#{rank}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Full List */}
            <div className="w-full max-w-lg px-4 mt-5 space-y-2">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        key={i}
                        className={`flex items-center justify-between p-3 rounded-xl border ${i <= 5 ? 'bg-white border-amber-100 shadow-sm' : 'bg-white/50 border-slate-100'} transition-all active:scale-[0.98] cursor-pointer`}
                    >
                        <div className="flex items-center gap-3">
                            <span className={`font-black text-base w-5 ${i === 1 ? 'text-amber-500' : i <= 3 ? 'text-slate-600' : 'text-slate-300'}`}>
                                {i}
                            </span>
                            <div className={`h-9 w-9 rounded-full border-2 ${i === 1 ? 'border-amber-200' : 'border-slate-100'} bg-slate-50`} />
                            <div>
                                <h3 className="font-bold text-slate-700 text-sm">Santri Terpuji {i}</h3>
                                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Level {10 - i}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="font-black text-amber-600 text-sm block">{1500 - (i * 100)}</span>
                            <span className="text-[9px] text-muted-foreground font-bold">XP</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
