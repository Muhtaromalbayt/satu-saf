
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Church as Mosque,
    BookOpen,
    Sparkles,
    HeartHandshake,
    Moon,
    Clock,
    ChevronRight,
    Plus,
    Minus,
    Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AmalanItem {
    id: string;
    label: string;
    icon: any;
    isSpecial?: boolean; // For Tadarus
}

const DEFAULT_AMALAN: AmalanItem[] = [
    { id: 'subuh', label: 'Sholat Subuh', icon: Mosque },
    { id: 'dzuhur', label: 'Sholat Dzuhur', icon: Mosque },
    { id: 'ashar', label: 'Sholat Ashar', icon: Mosque },
    { id: 'maghrib', label: 'Sholat Maghrib', icon: Mosque },
    { id: 'isya', label: 'Sholat Isya', icon: Mosque },
    { id: 'tarawih', label: 'Sholat Tarawih', icon: Moon },
    { id: 'witir', label: 'Sholat Witir', icon: Moon },
    { id: 'dhuha', label: 'Sholat Dhuha', icon: Clock },
    { id: 'tilawah', label: 'Tilawah Quran', icon: BookOpen },
    { id: 'tadarus', label: 'Tadarus', icon: BookOpen, isSpecial: true },
    { id: 'sedekah', label: 'Sedekah Harian', icon: HeartHandshake },
    { id: 'dzikir', label: 'Dzikir Pagi/Petang', icon: Sparkles },
    { id: 'bantu_ortu', label: 'Bantu Orang Tua', icon: HeartHandshake },
];

interface AmalanTrackerProps {
    items?: { id: string, label: string, icon?: string, isSpecial?: boolean }[];
    onComplete: (data: any) => void;
}

const ICON_MAP: Record<string, any> = {
    mosque: Mosque,
    book: BookOpen,
    sparkles: Sparkles,
    heart: HeartHandshake,
    moon: Moon,
    clock: Clock,
    quran: BookOpen,
    sholat: Mosque,
    sedekah: HeartHandshake
};

export default function AmalanTracker({ items, onComplete }: AmalanTrackerProps) {
    const amalanToRender = items ? items.map(item => ({
        ...item,
        icon: item.icon && ICON_MAP[item.icon.toLowerCase()] ? ICON_MAP[item.icon.toLowerCase()] : Mosque
    })) : DEFAULT_AMALAN;

    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const [tadarusCount, setTadarusCount] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("satusaf-amalan-progress");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setChecked(parsed.checked || {});
                setTadarusCount(parsed.tadarusCount || 0);
            } catch (e) {
                console.error("Failed to load amalan state", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("satusaf-amalan-progress", JSON.stringify({ checked, tadarusCount }));
        }
    }, [checked, tadarusCount, isLoaded]);

    const toggleCheck = (id: string) => {
        const isCurrentlyChecked = checked[id];

        // Pop sound simulation
        try {
            const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3");
            audio.volume = 0.2;
            audio.play().catch(() => { });
        } catch (e) { }

        setChecked(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const checkedCount = Object.values(checked).filter(Boolean).length;
    const canProceed = checkedCount >= 5;

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto p-4 space-y-8">
            <div className="text-center space-y-2">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full font-black text-[10px] uppercase tracking-[0.2em] border border-amber-200 mb-2"
                >
                    <Trophy className="w-3 h-3" />
                    Target Harian
                </motion.div>
                <h2 className="text-4xl font-black text-slate-800 tracking-tight">AMALAN YAUMI</h2>
                <p className="text-slate-500 font-bold">Lacak kebaikanmu hari ini. <span className="text-emerald-600">Selesaikan minimal 5.</span></p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {amalanToRender.map((item) => {
                    const isActive = checked[item.id];
                    const Icon = item.icon;

                    return (
                        <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.05, y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleCheck(item.id)}
                            className={cn(
                                "relative p-5 rounded-[2.5rem] border-4 cursor-pointer transition-all flex flex-col items-center gap-4 text-center group overflow-hidden",
                                isActive
                                    ? "bg-emerald-500 border-emerald-400 text-white shadow-xl shadow-emerald-200"
                                    : "bg-slate-50 border-slate-100 text-slate-400 hover:border-emerald-200 hover:bg-white"
                            )}
                        >
                            {/* Animated Background for Active State */}
                            <AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 -z-10"
                                    />
                                )}
                            </AnimatePresence>

                            <div className={cn(
                                "h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300",
                                isActive ? "bg-white/20 scale-110" : "bg-white shadow-sm group-hover:scale-110"
                            )}>
                                <Icon className={cn("h-7 w-7", isActive ? "text-white" : "text-slate-300 group-hover:text-emerald-500")} />
                            </div>

                            <div className="space-y-1">
                                <span className="font-black text-xs uppercase tracking-wider leading-tight block">{item.label}</span>

                                {item.isSpecial && isActive && (
                                    <div className="flex items-center justify-center gap-3 pt-3" onClick={(e) => e.stopPropagation()}>
                                        <motion.button
                                            whileTap={{ scale: 0.8 }}
                                            onClick={() => setTadarusCount(Math.max(0, tadarusCount - 1))}
                                            className="h-7 w-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors border border-white/20"
                                        >
                                            <Minus className="h-3.5 w-3.5" />
                                        </motion.button>
                                        <span className="font-black text-xl min-w-[1.5ch] tabular-nums">{tadarusCount}</span>
                                        <motion.button
                                            whileTap={{ scale: 0.8 }}
                                            onClick={() => setTadarusCount(tadarusCount + 1)}
                                            className="h-7 w-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors border border-white/20"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                        </motion.button>
                                    </div>
                                )}
                            </div>

                            <AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="absolute top-3 right-3 bg-amber-400 text-white rounded-full p-1 shadow-lg z-10"
                                    >
                                        <ChevronRight className="h-3 w-3 rotate-[-45deg] stroke-[4]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            <div className="h-24 flex items-center justify-center pt-4">
                <AnimatePresence>
                    {canProceed ? (
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.9 }}
                            className="flex flex-col items-center gap-4 w-full"
                        >
                            <motion.div
                                animate={{ y: [0, -4, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="bg-emerald-50 text-emerald-700 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border-2 border-emerald-100 shadow-sm"
                            >
                                ALHAMDULILLAH! {checkedCount} AMALAN SELESAI
                            </motion.div>
                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onComplete({ checked, tadarusCount })}
                                className="w-full max-w-sm py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-xl uppercase tracking-widest shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-3 active:bg-emerald-700"
                            >
                                LANJUTKAN <ChevronRight className="h-6 w-6 text-amber-300" />
                            </motion.button>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-emerald-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(checkedCount / 5) * 100}%` }}
                                />
                            </div>
                            <p className="font-black text-[10px] text-slate-400 uppercase tracking-widest">
                                {5 - checkedCount} LAGI UNTUK LANJUT
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
