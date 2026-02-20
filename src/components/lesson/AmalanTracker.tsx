
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
    Minus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AmalanItem {
    id: string;
    label: string;
    icon: any;
    isSpecial?: boolean; // For Tadarus
}

const DEFAULT_AMALAN: AmalanItem[] = [
    { id: 'sholat', label: 'Sholat Berjamaah', icon: Mosque },
    { id: 'rawatib', label: 'Sholat Rawatib', icon: Clock },
    { id: 'tilawah', label: 'Tilawah Quran', icon: BookOpen },
    { id: 'dzikir', label: 'Dzikir Pagi/Petang', icon: Sparkles },
    { id: 'sedekah', label: 'Sedekah Harian', icon: HeartHandshake },
    { id: 'doa', label: 'Doa & Dzikir Malam', icon: Moon },
    { id: 'tadarus', label: 'Tadarus', icon: BookOpen, isSpecial: true },
];

interface AmalanTrackerProps {
    onComplete: (data: any) => void;
}

export default function AmalanTracker({ onComplete }: AmalanTrackerProps) {
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
        // Pop sound simulation
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3");
        audio.volume = 0.2;
        audio.play().catch(() => { }); // Catch if browser blocks autoplay

        setChecked(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const checkedCount = Object.values(checked).filter(Boolean).length;
    const canProceed = checkedCount >= 5;

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto p-4 space-y-10">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-slate-800">AMALAN YAUMI</h2>
                <p className="text-slate-500 font-bold">Lacak kebaikanmu hari ini. Minimum 5 amalan.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {DEFAULT_AMALAN.map((item) => {
                    const isActive = checked[item.id];
                    const Icon = item.icon;

                    return (
                        <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleCheck(item.id)}
                            className={cn(
                                "relative p-6 rounded-[2rem] border-4 cursor-pointer transition-all flex flex-col items-center gap-4 text-center group",
                                isActive
                                    ? "bg-emerald-500 border-emerald-400 text-white shadow-xl shadow-emerald-200"
                                    : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200"
                            )}
                        >
                            <div className={cn(
                                "h-16 w-16 rounded-[1.5rem] flex items-center justify-center transition-colors",
                                isActive ? "bg-white/20" : "bg-white shadow-sm"
                            )}>
                                <Icon className={cn("h-8 w-8", isActive ? "text-white" : "text-slate-400")} />
                            </div>

                            <div className="space-y-1">
                                <span className="font-black text-sm uppercase tracking-wider">{item.label}</span>
                                {item.isSpecial && isActive && (
                                    <div className="flex items-center gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => setTadarusCount(Math.max(0, tadarusCount - 1))}
                                            className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="font-black text-lg min-w-[2ch]">{tadarusCount}</span>
                                        <button
                                            onClick={() => setTadarusCount(tadarusCount + 1)}
                                            className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {isActive && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 bg-amber-400 text-white rounded-full p-1.5 shadow-lg"
                                >
                                    <ChevronRight className="h-4 w-4 rotate-[-45deg]" />
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            <AnimatePresence>
                {canProceed && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="pt-8 flex flex-col items-center gap-4"
                    >
                        <div className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest border-2 border-emerald-100 animate-bounce">
                            MASYA ALLAH! {checkedCount} AMALAN SELESAI
                        </div>
                        <button
                            onClick={() => onComplete({ checked, tadarusCount })}
                            className="w-full max-w-sm py-6 bg-primary text-white rounded-[2.5rem] font-black text-2xl uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            SIMPAN & LANJUT <ChevronRight className="h-8 w-8 text-amber-300" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
