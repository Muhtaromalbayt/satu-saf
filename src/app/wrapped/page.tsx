"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Flame, Sparkles, Share2, ChevronRight, X, Heart, Map as MapIcon, Compass } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { sounds } from "@/lib/utils/sounds";
import Link from "next/link";

interface WrappedStats {
    totalVerified: number;
    streak: number;
    totalScore: number;
    topBadge: string | null;
    totalBadges: number;
    topAspect: string;
}

const badgeMetadata: Record<string, { name: string, icon: string }> = {
    'streak_3': { name: 'Semangat Membara', icon: '🔥' },
    'streak_7': { name: 'Pendekar Istiqomah', icon: '⚔️' },
    'streak_14': { name: 'Legenda Hijrah', icon: '👑' },
    'perfect_day': { name: 'Pahlawan Taqwa', icon: '🏆' },
    'special_mission': { name: 'Explorer Sejati', icon: '🌟' },
};

export default function WrappedPage() {
    const { user } = useAuth();
    const { isMidnight } = useTheme();
    const [stats, setStats] = useState<WrappedStats | null>(null);
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/wrapped");
                if (!res.ok) throw new Error("Gagal mengambil rapor");
                const data = await res.json();
                setStats(data.stats);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const nextStep = () => {
        sounds?.play("click");
        setStep(prev => prev + 1);
    };

    if (loading) {
        return (
            <div className={cn(
                "min-h-screen flex items-center justify-center transition-colors duration-1000",
                isMidnight ? "bg-slate-950 text-white" : "bg-emerald-900 text-white"
            )}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <Sparkles className="h-12 w-12 text-amber-400" />
                </motion.div>
            </div>
        );
    }

    if (!stats) return null;

    const steps = [
        // 0: Intro
        (
            <div className="flex flex-col items-center justify-center text-center gap-6">
                <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="h-32 w-32 bg-amber-400 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-amber-400/20"
                >
                    <Star className="h-16 w-16 text-white text-3xl" />
                </motion.div>
                <div className="space-y-2 px-6">
                    <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">Rapor Kebaikan</h1>
                    <p className="text-white/60 text-sm font-bold uppercase tracking-widest">Ananda {user?.name}</p>
                </div>
                <p className="text-white/80 text-lg font-medium px-8 leading-relaxed max-w-sm mt-4">
                    "Setiap butir amalanmu adalah langkah menuju Ridho-Nya."
                </p>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={nextStep}
                    className="mt-12 group flex items-center gap-3 bg-white text-emerald-900 px-8 py-4 rounded-full font-black uppercase tracking-widest text-[11px] shadow-2xl"
                >
                    MULAI FLASHBACK <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </div>
        ),
        // 1: Total Deeds
        (
            <div className="flex flex-col items-center text-center gap-8 w-full max-w-xs mx-auto">
                <div className="space-y-4">
                    <p className="text-white/60 text-xs font-black uppercase tracking-[0.3em]">Minggu Ini Kamu Selesaikan</p>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-8xl font-black tabular-nums tracking-tighter text-white"
                    >
                        {stats.totalVerified}
                    </motion.h2>
                    <p className="text-white text-xl font-black uppercase tracking-widest">AMALAN TERVERIFIKASI</p>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5 }}
                        className="h-full bg-emerald-400" 
                    />
                </div>
                <p className="text-white/60 text-sm font-medium italic">
                    Konsistensimu di aspek <span className="text-amber-400 font-bold">{stats.topAspect}</span> sungguh luar biasa! ✨
                </p>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={nextStep}
                    className="mt-8 flex items-center gap-2 text-white/40 font-black uppercase tracking-widest text-[11px]"
                >
                    LANJUTKAN <ChevronRight className="h-4 w-4" />
                </motion.button>
            </div>
        ),
        // 2: Streak & Badges
        (
            <div className="flex flex-col items-center text-center gap-10 w-full px-6">
                <div className="space-y-2">
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Pencapaian Tertinggi</p>
                    <div className="flex items-center justify-center gap-6">
                        <div className="flex flex-col items-center">
                            <div className="h-20 w-20 bg-orange-500 rounded-3xl flex items-center justify-center mb-3 shadow-xl shadow-orange-500/20">
                                <Flame className="h-10 w-10 text-white fill-white" />
                            </div>
                            <p className="text-2xl font-black text-white">{stats.streak} Hari</p>
                            <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest mt-1">Streak Combo</p>
                        </div>
                        <div className="w-px h-16 bg-white/10" />
                        <div className="flex flex-col items-center">
                            <div className="h-20 w-20 bg-indigo-500 rounded-3xl flex items-center justify-center mb-3 shadow-xl shadow-indigo-500/20">
                                <Trophy className="h-10 w-10 text-white" />
                            </div>
                            <p className="text-2xl font-black text-white">{stats.totalBadges}</p>
                            <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest mt-1">Badge Koleksi</p>
                        </div>
                    </div>
                </div>

                {stats.topBadge && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white/10 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/20 w-full max-w-sm"
                    >
                        <p className="text-amber-400 text-[10px] font-black tracking-widest uppercase mb-4">Badge Kehormatan</p>
                        <div className="text-6xl mb-4">{badgeMetadata[stats.topBadge]?.icon}</div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tight">{badgeMetadata[stats.topBadge]?.name}</h4>
                        <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest mt-2">Diberikan atas keteladanan tertinggi</p>
                    </motion.div>
                )}

                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={nextStep}
                    className="flex items-center gap-2 text-white/40 font-black uppercase tracking-widest text-[11px]"
                >
                    LANJUTKAN <ChevronRight className="h-4 w-4" />
                </motion.button>
            </div>
        ),
        // 3: Closing & Share
        (
            <div className="flex flex-col items-center text-center gap-10 w-full px-8 pb-12">
                <div className="space-y-4">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="h-24 w-24 bg-rose-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-rose-500/20"
                    >
                        <Heart className="h-10 w-10 text-white fill-white" />
                    </motion.div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Baarakallaahu <br/> Fiikum!</h2>
                    <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                        Terima kasih sudah menjadi inspirasi kebaikan selama minggu ini. Peta tantangan selanjutnya telah menantimu!
                    </p>
                </div>

                <div className="w-full space-y-4">
                    <button
                        onClick={() => {
                            const text = `Alhamdulillah! Pekan ini saya sudah menyelesaikan ${stats.totalVerified} amalan di SATU SAF. Streak tertinggi ${stats.streak} hari dengan gelar ${badgeMetadata[stats.topBadge || '']?.name || 'Pahlawan Taqwa'}! 🌟🙌`;
                            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
                        }}
                        className="w-full bg-emerald-400 text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 shadow-2xl"
                    >
                        <Share2 className="h-4 w-4" /> BAGIKAN KEBAIKAN
                    </button>
                    <Link href="/map" className="block w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-colors">
                        KEMBALI KE PETA
                    </Link>
                </div>

                <div className="mt-8 flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 opacity-40">
                        <Compass className="h-4 w-4 text-white" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">SatuSaf Journey</span>
                    </div>
                </div>
            </div>
        )
    ];

    return (
        <div className={cn(
            "min-h-screen relative overflow-hidden flex items-center justify-center transition-colors duration-1000",
            isMidnight ? "bg-slate-950" : "bg-emerald-900"
        )}>
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-amber-500/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')] opacity-10" />
            </div>

            <main className="relative z-10 w-full max-w-lg mx-auto min-h-screen flex flex-col items-center justify-center py-10">
                {/* Progress bar at the top */}
                <div className="absolute top-10 left-6 right-6 flex gap-1.5 px-4 z-50">
                    {steps.map((_, i) => (
                        <div key={i} className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                            {i <= step && (
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    className="h-full bg-white" 
                                />
                            )}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                        className="w-full"
                    >
                        {steps[step]}
                    </motion.div>
                </AnimatePresence>

                {/* Corner controls */}
                <Link href="/map" className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                    <X className="h-6 w-6" />
                </Link>
            </main>
        </div>
    );
}
