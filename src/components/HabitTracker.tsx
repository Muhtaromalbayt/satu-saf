"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart,
    User,
    Globe,
    Star,
    CheckCircle2,
    Circle,
    ChevronRight,
    MessageCircle,
    Info,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Habit {
    id: string;
    label: string;
    aspect: 'allah' | 'parents' | 'environment' | 'self';
    description?: string;
}

const HABITS: Habit[] = [
    // Allah
    { id: 'sholat_5', label: 'Sholat 5 Waktu', aspect: 'allah', description: 'Menegakkan tiang agama tepat waktu.' },
    { id: 'tadarus', label: 'Tadarus Al-Qur\'an', aspect: 'allah', description: 'Membaca dan merenungi ayat suci.' },
    { id: 'dzikir', label: 'Dzikir Pagi/Petang', aspect: 'allah', description: 'Mengingat Allah di setiap waktu.' },

    // Parents
    { id: 'bantu_ortu', label: 'Bantu Orang Tua', aspect: 'parents', description: 'Membantu pekerjaan rumah atau keperluan lainnya.' },
    { id: 'doa_ortu', label: 'Doakan Orang Tua', aspect: 'parents', description: 'Mendoakan kebaikan dunia akhirat untuk mereka.' },
    { id: 'salam_ortu', label: 'Izin & Salim', aspect: 'parents', description: 'Berpamitan dan bersikap hormat.' },

    // Environment
    { id: 'sedekah', label: 'Sedekah/Infaq', aspect: 'environment', description: 'Membantu sesama dengan harta.' },
    { id: 'bersih_lingkungan', label: 'Jaga Kebersihan', aspect: 'environment', description: 'Membuang sampah pada tempatnya.' },
    { id: 'senyum_salam', label: 'Senyum & Salam', aspect: 'environment', description: 'Menyebarkan kedamaian di masyarakat.' },

    // Self
    { id: 'belajar', label: 'Waktu Belajar', aspect: 'self', description: 'Menambah ilmu pengetahuan.' },
    { id: 'olahraga', label: 'Olahraga', aspect: 'self', description: 'Menjaga amanah tubuh tetap sehat.' },
    { id: 'tidur_awal', label: 'Tidur Awal', aspect: 'self', description: 'Istirahat cukup agar segar saat subuh.' },
];

const ASPECT_CONFIG = {
    allah: { icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100', label: 'Kepada Allah' },
    parents: { icon: User, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', label: 'Kepada Orang Tua' },
    environment: { icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', label: 'Bagai Lingkungan' },
    self: { icon: Star, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100', label: 'Untuk Diri Sendiri' },
};

export default function HabitTracker() {
    const [activeTab, setActiveTab] = useState<'allah' | 'parents' | 'environment' | 'self'>('allah');
    const [logs, setLogs] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await fetch('/api/habits/log');
            const data = await res.json();
            if (data.logs) {
                const logMap: Record<string, any> = {};
                data.logs.forEach((log: any) => {
                    logMap[log.deedName] = log;
                });
                setLogs(logMap);
            }
        } catch (error) {
            console.error("Failed to fetch logs", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleHabit = async (habit: Habit) => {
        const isDone = logs[habit.id]?.status === 'done';
        const newStatus = isDone ? 'not_done' : 'done';

        // Optimistic update
        setLogs(prev => ({
            ...prev,
            [habit.id]: { ...prev[habit.id], status: newStatus, verifiedByParent: false }
        }));

        try {
            const res = await fetch('/api/habits/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    aspect: habit.aspect,
                    deedName: habit.id,
                    status: newStatus
                })
            });
            const data = await res.json();
            if (data.success) {
                // Update with actual server data (like ID)
                setLogs(prev => ({
                    ...prev,
                    [habit.id]: { ...prev[habit.id], id: data.id }
                }));
            }
        } catch (error) {
            console.error("Failed to log habit", error);
            // Revert on error
            setLogs(prev => ({
                ...prev,
                [habit.id]: { ...prev[habit.id], status: isDone ? 'done' : 'not_done' }
            }));
        }
    };

    const filteredHabits = HABITS.filter(h => h.aspect === activeTab);

    return (
        <div className="space-y-6">
            {/* Aspect Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {(Object.keys(ASPECT_CONFIG) as Array<keyof typeof ASPECT_CONFIG>).map((key) => {
                    const config = ASPECT_CONFIG[key];
                    const isActive = activeTab === key;
                    const Icon = config.icon;
                    return (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 rounded-2xl font-bold whitespace-nowrap transition-all border-2",
                                isActive
                                    ? cn(config.bg, config.border, config.color, "shadow-sm scale-105")
                                    : "bg-white border-slate-50 text-slate-400 opacity-60 hover:opacity-100"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            <span className="text-xs uppercase tracking-wider">{config.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Habit List */}
            <div className="space-y-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-3"
                    >
                        {filteredHabits.map((habit) => {
                            const log = logs[habit.id];
                            const isDone = log?.status === 'done';
                            const isVerified = log?.verifiedByParent;
                            const config = ASPECT_CONFIG[habit.aspect];

                            return (
                                <div
                                    key={habit.id}
                                    onClick={() => toggleHabit(habit)}
                                    className={cn(
                                        "group p-4 rounded-3xl border-2 transition-all cursor-pointer flex items-center gap-4",
                                        isDone
                                            ? "bg-slate-50 border-primary/20 shadow-sm"
                                            : "bg-white border-slate-50 hover:border-slate-100"
                                    )}
                                >
                                    <div className={cn(
                                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-all",
                                        isDone ? "bg-primary text-white scale-110 shadow-lg" : "bg-slate-50 text-slate-300"
                                    )}>
                                        {isDone ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className={cn(
                                            "font-bold text-lg leading-tight",
                                            isDone ? "text-slate-800" : "text-slate-400"
                                        )}>
                                            {habit.label}
                                        </h3>
                                        <p className="text-xs text-slate-400 truncate">{habit.description}</p>
                                    </div>

                                    {isDone && (
                                        <div className="flex flex-col items-end gap-1">
                                            {isVerified ? (
                                                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    <span className="text-[10px] font-black uppercase">Verified</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-lg">
                                                    <AlertCircle className="h-3 w-3" />
                                                    <span className="text-[10px] font-black uppercase">Pending</span>
                                                </div>
                                            )}
                                            {log?.parentNote && (
                                                <div className="flex items-center gap-1 text-slate-400 group-hover:text-primary transition-colors">
                                                    <MessageCircle className="h-3 w-3" />
                                                    <span className="text-[10px] italic">Notes</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Overall Progress Info */}
            <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white overflow-hidden relative">
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h4 className="text-indigo-200 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Status Pantauan</h4>
                        <p className="text-xl font-bold">Ajak Orang Tua Verifikasi!</p>
                    </div>
                    <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center">
                        <Info className="h-6 w-6 text-indigo-300" />
                    </div>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl -ml-12 -mb-12" />
            </div>
        </div>
    );
}
