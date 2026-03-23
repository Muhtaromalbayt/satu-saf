"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart, User, Globe, Star, BookOpen,
    Loader2, Trophy, ChevronRight, LayoutGrid, Target,
    Cloud, Trees, Mountain, Wind, Lock,
    Anchor, Compass, Skull, Palmtree, Ship, Map as MapIcon, Gem, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MONITORING_ASPECTS, MonitoringAspectId } from "@/lib/constants/monitoring";
import TaskMission from "@/components/monitoring/TaskMission";
import MissionSelect from "@/components/monitoring/MissionSelect";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { sounds } from "@/lib/utils/sounds";

interface AmalanLog {
    id: number;
    aspect: string;
    deedName: string;
    status: string;
    day: number;
    evidenceUrl?: string;
    reflection?: string;
    capturedAt?: string;
}

interface Task {
    id: number;
    aspectId: string;
    label: string;
    isActive: boolean;
    displayOrder: number;
}

const TOTAL_DAYS = 14;

export default function MapPage() {
    const { user } = useAuth();
    const [activeDay, setActiveDay] = useState(1); // Current day in the journey (from settings)
    const [missionStartDate, setMissionStartDate] = useState<string>("");
    const [selectedDay, setSelectedDay] = useState<number | null>(null); // Day selected to show aspects
    const [logs, setLogs] = useState<AmalanLog[]>([]);
    const [tasks, setTasks] = useState<Task[]>(() =>
        MONITORING_ASPECTS.flatMap((aspect: any) =>
            aspect.tasks.map((taskLabel: string, index: number) => ({
                id: Math.random(),
                aspectId: aspect.id,
                label: taskLabel,
                isActive: true,
                displayOrder: index
            }))
        )
    );
    const [loading, setLoading] = useState(true);
    const [selectedAspectId, setSelectedAspectId] = useState<MonitoringAspectId | null>(null);

    // Immersive State
    const [missionSelectOpen, setMissionSelectOpen] = useState(false);
    const [dailyQuestOpen, setDailyQuestOpen] = useState(false);
    const [streak, setStreak] = useState(0);
    const [currentDayProgress, setCurrentDayProgress] = useState(0);
    const { isMidnight } = useTheme();
    const [badgesOpen, setBadgesOpen] = useState(false);
    const [earnedBadges, setEarnedBadges] = useState<string[]>([]);



    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                await Promise.all([fetchLogs(), fetchTasks(), fetchCurrentDay(), fetchStreak(), fetchBadges()]);
                
                // Show Daily Quest pop-up if it's the first time today
                const lastSeen = localStorage.getItem("last_daily_quest_seen");
                const todayStr = new Date().toDateString();
                if (lastSeen !== todayStr) {
                    setDailyQuestOpen(true);
                    localStorage.setItem("last_daily_quest_seen", todayStr);
                }
            } catch (err) {
                console.error("Initialization error:", err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const fetchCurrentDay = async () => {
        try {
            const res = await fetch("/api/settings");
            if (!res.ok) return;
            const data = await res.json();
            if (data.currentDay) {
                setActiveDay(data.currentDay);
            }
            if (data.missionStartDate) {
                setMissionStartDate(data.missionStartDate);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTasks = async () => {
        try {
            const res = await fetch("/api/tasks");
            if (!res.ok) throw new Error("Failed to fetch tasks");
            const data = await res.json();
            const fetchedTasks = data.tasks || [];

            if (fetchedTasks.length > 0) {
                setTasks(fetchedTasks);
            }
            // If empty, we keep the initial fallback state
        } catch (err) {
            console.error("fetchTasks error, sticking with fallback:", err);
        }
    };

    const fetchLogs = async () => {
        try {
            const res = await fetch("/api/habits/log?all=true");
            if (!res.ok) throw new Error("Failed to fetch logs");
            const text = await res.text();
            if (!text) return;
            const data = JSON.parse(text);
            setLogs(data.logs || []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchBadges = async () => {
        try {
            const res = await fetch("/api/badges");
            if (!res.ok) return;
            const data = await res.json();
            if (data.badges) {
                setEarnedBadges(data.badges.map((b: any) => b.badgeType));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchStreak = async () => {
        try {
            const res = await fetch("/api/scores");
            if (!res.ok) return;
            const data = await res.json();
            if (data.scores?.streakCount !== undefined) {
                setStreak(data.scores.streakCount);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getDayProgress = (day: number) => {
        const activeTasks = tasks.filter(t => t.isActive);
        if (activeTasks.length === 0) return 0;

        const doneCount = logs.filter(l => l.day === day && l.status === "verified").length;
        return (doneCount / activeTasks.length) * 100;
    };

    const handleSaveTask = async (taskName: string, data: { status: string, evidenceUrl?: string, reflection?: string, capturedAt?: string }) => {
        if (!selectedAspectId || !selectedDay) return;

        // Optimistic update
        setLogs(prev => {
            const filtered = prev.filter(l => !(l.day === selectedDay && l.aspect === selectedAspectId && l.deedName === taskName));
            return [...filtered, {
                id: Math.random(),
                day: selectedDay,
                aspect: selectedAspectId,
                deedName: taskName,
                status: data.status,
                evidenceUrl: data.evidenceUrl,
                reflection: data.reflection,
                capturedAt: data.capturedAt
            }];
        });

        try {
            const res = await fetch("/api/habits/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    day: selectedDay,
                    aspect: selectedAspectId,
                    deedName: taskName,
                    status: data.status,
                    evidenceUrl: data.evidenceUrl,
                    reflection: data.reflection,
                    capturedAt: data.capturedAt
                }),
            });
            if (!res.ok) throw new Error("Save failed");
        } catch (err) {
            console.error(err);
            fetchLogs(); // Revert on error
        }
    };

    const handleNodeClick = (day: number) => {
        // Date-based locking logic
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let calculatedActiveDay = activeDay;
        if (missionStartDate) {
            const startDate = new Date(missionStartDate);
            startDate.setHours(0, 0, 0, 0);
            const diffTime = today.getTime() - startDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            calculatedActiveDay = diffDays + 1;
        }

        const isDemo = user?.id === "demo_santri" || (user?.name === "Santri Demo" && user?.kelompok === "Demo");

        if (!isDemo && day !== calculatedActiveDay) {
            return;
        }

        sounds?.play("open");
        setSelectedDay(day);
        setCurrentDayProgress(getDayProgress(day));
        setMissionSelectOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
            </div>
        );
    }

    const totalActiveTasksCount = tasks.filter((t: Task) => t.isActive).length;
    const overallProgress = totalActiveTasksCount > 0
        ? (logs.filter(l => l.status === "verified").length / (TOTAL_DAYS * totalActiveTasksCount)) * 100
        : 0;

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    let computedActiveDay = activeDay;
    if (missionStartDate) {
        const startDate = new Date(missionStartDate);
        startDate.setHours(0, 0, 0, 0);
        const diffTime = todayDate.getTime() - startDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        computedActiveDay = diffDays + 1;
    }
    const clampedActiveDay = Math.max(0, Math.min(14, computedActiveDay));

    return (
        <div className={cn(
            "min-h-screen pb-32 font-sans selection:bg-amber-100 selection:text-amber-900 relative transition-colors duration-1000",
            isMidnight ? "bg-background" : "bg-[#F4EBD0]"
        )}>
            {/* Twinkling Stars for Midnight Mode */}
            {isMidnight && (
                <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: Math.random(), scale: Math.random() }}
                            animate={{ 
                                opacity: [0.2, 0.8, 0.2],
                                scale: [1, 1.2, 1]
                            }}
                            transition={{ 
                                duration: 2 + Math.random() * 3, 
                                repeat: Infinity,
                                delay: Math.random() * 5
                            }}
                            className="absolute bg-white rounded-full"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                width: Math.random() * 3 + 'px',
                                height: Math.random() * 3 + 'px',
                                boxShadow: '0 0 10px rgba(255,255,255,0.8)'
                            }}
                        />
                    ))}
                    {/* Aurora effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent opacity-30" />
                </div>
            )}

            {/* Texture Overlay */}
            <div className={cn(
                "fixed inset-0 opacity-[0.04] pointer-events-none z-10",
                isMidnight ? "invert opacity-[0.02]" : ""
            )} style={{ backgroundImage: 'repeating-conic-gradient(#8B7355 0% 25%, transparent 0% 50%)', backgroundSize: '3px 3px' }} />

            {/* Header */}
            <div className={cn(
                "sticky top-0 z-30 p-5 pb-10 text-center rounded-b-[2.5rem] shadow-xl relative overflow-hidden border-b-4 transition-colors duration-1000",
                isMidnight 
                    ? "bg-slate-900/80 backdrop-blur-xl border-slate-800" 
                    : "bg-emerald-900 border-emerald-950/30"
            )}>
                <motion.div
                    initial={{ scale: 0, rotate: -12 }}
                    animate={{ scale: 1, rotate: 12 }}
                    className="absolute -top-2 -right-2 text-white/10"
                >
                    <MapIcon className="h-32 w-32" />
                </motion.div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                            <Trophy className="h-3 w-3 text-amber-400" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{Math.round(overallProgress)}% Selesai</span>
                        </div>
                        {streak > 0 && (
                            <motion.div 
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 0 }}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="inline-flex items-center gap-1.5 bg-orange-500/20 backdrop-blur-md px-3 py-1 rounded-full border border-orange-500/30 cursor-help"
                            >
                                <span className={cn(
                                    "text-orange-500",
                                    streak >= 3 && "animate-pulse drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]"
                                )}>🔥</span>
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{streak} Streak</span>
                            </motion.div>
                        )}
                    </div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter leading-none font-serif">
                        Peta Karunia
                    </h1>
                    <p className={cn(
                        "text-[10px] font-bold uppercase tracking-widest mt-2",
                        isMidnight ? "text-indigo-200/60" : "text-emerald-100/60"
                    )}>
                        Mencari Harta Taqwa
                    </p>
                </div>
            </div>

            {/* Motivational Banner */}
            <div className="px-4 mt-6 max-w-md mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                        "p-4 rounded-2xl shadow-sm flex items-center gap-4 overflow-hidden relative border-2 transition-colors duration-1000",
                        isMidnight ? "bg-card border-slate-700/50" : "bg-white/80 backdrop-blur-sm border-slate-100"
                    )}
                >
                    <div className="absolute top-0 right-0 p-2 opacity-5 scale-150"><Target className="h-12 w-12 text-primary" /></div>
                    <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                        isMidnight ? "bg-primary/20" : "bg-primary/10"
                    )}>
                        <Star className="h-5 w-5 text-primary fill-primary/20" />
                    </div>
                    <div>
                        <h4 className={cn("text-xs font-black uppercase tracking-tight", isMidnight ? "text-emerald-400" : "text-slate-800")}>Kebut Semangatmu!</h4>
                        <p className={cn("text-[11px] font-bold leading-tight mt-0.5", isMidnight ? "text-slate-400" : "text-slate-500")}>
                            {getDayProgress(clampedActiveDay) < 100 
                                ? `Tinggal ${Math.max(1, Math.round(100 - getDayProgress(clampedActiveDay)))}% lagi untuk mencapai target hari ini! 🔥` 
                                : "Luar biasa! Target hari ini telah tercapai sepenuhnya. ✨"}
                        </p>
                    </div>
                </motion.div>

                {/* Weekly Wrapped Trigger */}
                {(clampedActiveDay === 7 || clampedActiveDay === 14) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4"
                    >
                        <Link href="/wrapped" className="block group">
                            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-between border-b-4 border-orange-800 active:border-b-0 active:translate-y-1 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                                        <Sparkles className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-white uppercase tracking-tight">Rapor Kebaikan Mingguan!</h4>
                                        <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest leading-none mt-1">Lihat Pencapaianmu Pekan Ini ✨</p>
                                    </div>
                                </div>
                                <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center self-center group-hover:translate-x-1 transition-transform">
                                    <ChevronRight className="h-4 w-4 text-white" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                )}
            </div>

            {/* Floating Badge Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { sounds?.play("click"); setBadgesOpen(true); }}
                className={cn(
                    "fixed bottom-6 right-6 h-14 w-14 rounded-2xl flex items-center justify-center shadow-2xl z-40 border-b-4 active:border-b-0 active:translate-y-1 transition-all",
                    isMidnight ? "bg-indigo-600 border-indigo-800 text-white" : "bg-amber-500 border-amber-700 text-white"
                )}
            >
                <Trophy className="h-7 w-7" />
                {earnedBadges.length > 0 && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 rounded-full flex items-center justify-center border-2 border-white text-[10px] font-black">
                        {earnedBadges.length}
                    </div>
                )}
            </motion.button>

            {/* Interactive Journey Map */}
            <div className="relative mt-12 px-4 max-w-md mx-auto min-h-[1500px]">
                {/* Background Decorations */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Pirate Themed Decorations */}
                    <div className="absolute top-20 -left-10 opacity-10 rotate-12">
                        <motion.div whileHover={{ rotate: 20, scale: 1.2 }} className="cursor-help">
                            <Anchor className={cn("h-24 w-24", isMidnight ? "text-indigo-400" : "text-emerald-900")} />
                        </motion.div>
                    </div>
                    <div className="absolute top-80 -right-5 opacity-10 -rotate-12">
                        <motion.div whileHover={{ rotate: -20, scale: 1.2 }} className="cursor-help">
                            <Compass className={cn("h-20 w-20", isMidnight ? "text-indigo-400" : "text-emerald-900")} />
                        </motion.div>
                    </div>
                    <div className="absolute top-[400px] left-4 opacity-5">
                        <motion.div whileHover={{ y: -10 }} className="cursor-help">
                            <Skull className={cn("h-16 w-16", isMidnight ? "text-indigo-400" : "text-emerald-900")} />
                        </motion.div>
                    </div>
                    <div className="absolute top-[700px] right-2 opacity-15">
                        <motion.div whileHover={{ scale: 1.1 }} className="cursor-help">
                            <Palmtree className={cn("h-20 w-20", isMidnight ? "text-indigo-400" : "text-emerald-900")} />
                        </motion.div>
                    </div>
                    <div className="absolute top-[1000px] left-10 opacity-5">
                        <motion.div whileHover={{ x: 20 }} className="cursor-help">
                            <Ship className={cn("h-20 w-20", isMidnight ? "text-indigo-400" : "text-emerald-900")} />
                        </motion.div>
                    </div>
                    <div className="absolute top-[1300px] right-8 opacity-15">
                        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 2 }} className="cursor-help">
                            <MapIcon className={cn("h-16 w-16", isMidnight ? "text-indigo-400" : "text-emerald-900")} />
                        </motion.div>
                    </div>
                </div>

                {/* The Path SVG - Treasure Trail Style */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 2000">
                    <motion.path
                        d={Array.from({ length: 14 }).reduce((acc: string, _, i) => {
                            const day = i + 1;
                            const y = i * 140 + 60;
                            const x = 50 + (day % 2 === 0 ? 25 : -25);
                            return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                        }, "")}
                        fill="none"
                        stroke="#A5B49D"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.3 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />
                    <motion.path
                        d={Array.from({ length: 14 }).reduce((acc: string, _, i) => {
                            const day = i + 1;
                            const y = i * 140 + 60;
                            const x = 50 + (day % 2 === 0 ? 25 : -25);
                            return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                        }, "")}
                        fill="none"
                        stroke={isMidnight ? "#334155" : "#A5B49D"}
                        strokeWidth="1"
                        strokeDasharray="3 3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.3 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />
                    <motion.path
                        d={Array.from({ length: 14 }).reduce((acc: string, _, i) => {
                            const day = i + 1;
                            const y = i * 140 + 60;
                            const x = 50 + (day % 2 === 0 ? 25 : -25);
                            return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                        }, "")}
                        fill="none"
                        stroke={isMidnight ? "#818cf8" : "#059669"}
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: clampedActiveDay / 14 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />
                </svg>

                {/* Nodes */}
                <div className="relative flex flex-col gap-10 py-10">
                    {Array.from({ length: 14 }, (_, i) => i + 1).map((day) => {
                        const progress = getDayProgress(day);
                        const isEven = day % 2 === 0;

                        // Date-based locking logic
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        let calculatedActiveDay = activeDay;
                        let openDate = null;
                        
                        if (missionStartDate) {
                            const startDate = new Date(missionStartDate);
                            startDate.setHours(0, 0, 0, 0);
                            
                            openDate = new Date(startDate);
                            openDate.setDate(startDate.getDate() + (day - 1));
                            
                            const diffTime = today.getTime() - startDate.getTime();
                            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                            calculatedActiveDay = diffDays + 1;
                        }

                        const isDemo = user?.id === "demo_santri" || (user?.name === "Santri Demo" && user?.kelompok === "Demo");
                        const isLocked = !isDemo && day !== calculatedActiveDay;
                        const isCurrent = day === calculatedActiveDay;
                        const isPast = day < calculatedActiveDay;

                        const dateString = openDate ? openDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : "";

                        return (
                            <motion.div
                                key={day}
                                initial={{ opacity: 0, scale: 0.5, y: 30 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ 
                                    type: "spring", 
                                    damping: 12, 
                                    stiffness: 100,
                                    delay: (day % 4) * 0.1 // Stagger effect
                                }}
                                className={cn(
                                    "relative w-full flex items-center mb-10",
                                    isEven ? "justify-[75%]" : "justify-[25%]",
                                    "justify-center" // Fallback
                                )}
                                style={{
                                    paddingLeft: isEven ? "50%" : "0%",
                                    paddingRight: isEven ? "0%" : "50%",
                                    transform: `translateX(${isEven ? "25%" : "-25"}%)`
                                }}
                            >
                                <button
                                    onClick={() => handleNodeClick(day)}
                                    className={cn(
                                        "group relative flex flex-col items-center transition-all",
                                        isLocked ? "cursor-not-allowed" : "hover:scale-110 active:scale-95"
                                    )}
                                >
                                    {isCurrent && (
                                        <div className="absolute -top-14 bg-amber-500 text-white text-[11px] font-black px-5 py-2.5 rounded-2xl animate-bounce shadow-xl shadow-amber-500/30 z-20 border-2 border-white uppercase tracking-widest leading-none">
                                            Misi Aktif
                                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-500 rotate-45 border-r-2 border-b-2 border-white" />
                                        </div>
                                    )}

                                    <div className={cn(
                                        "h-24 w-24 rounded-[2.5rem] flex items-center justify-center relative transition-all shadow-[0_15px_40px_rgba(0,0,0,0.15)] border-b-[8px] border-x-4 border-t-2 overflow-hidden",
                                        isLocked
                                            ? isMidnight ? "bg-slate-800/50 border-slate-900/50 opacity-40" : "bg-slate-200/50 border-slate-300/50"
                                            : isCurrent
                                                ? isMidnight ? "bg-indigo-600 border-indigo-800 ring-[12px] ring-indigo-500/10" : "bg-amber-400 border-amber-600 ring-[12px] ring-amber-400/20"
                                                : isMidnight ? "bg-slate-800 border-slate-900" : "bg-emerald-600 border-emerald-800 shadow-emerald-900/10"
                                    )}>
                                        {isCurrent && (
                                            <motion.div 
                                                animate={{ 
                                                    scale: [1, 1.2, 1],
                                                    opacity: [0.3, 0.6, 0.3]
                                                }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute inset-0 bg-white"
                                            />
                                        )}
                                        {/* Node Icon Based on Day */}
                                        <div className="flex flex-col items-center relative z-10">
                                            {!isLocked ? (
                                                day === 14 ? (
                                                    <Gem className="h-12 w-12 text-white animate-pulse" />
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-3xl font-black text-white leading-none">{day}</span>
                                                        <div className="mt-1">
                                                            {day % 4 === 0 ? <Anchor className="h-4 w-4 text-white/50" /> :
                                                                day % 4 === 1 ? <Compass className="h-4 w-4 text-white/50" /> :
                                                                    day % 4 === 2 ? <Skull className="h-4 w-4 text-white/50" /> :
                                                                        <Ship className="h-4 w-4 text-white/50" />}
                                                        </div>
                                                    </div>
                                                )
                                            ) : (
                                                <Lock className={cn("h-8 w-8", isMidnight ? "text-slate-500" : "text-[#5D4037]/40")} />
                                            )}
                                        </div>

                                        {/* Decorative Background for Node */}
                                        {!isLocked && (
                                            <div className="absolute top-0 right-0 p-1 opacity-[0.03] rotate-12">
                                                <Target className="h-16 w-16 text-current" />
                                            </div>
                                        )}

                                        {/* Completed Stamp */}
                                        {progress === 100 && !isLocked && (
                                            <motion.div
                                                initial={{ scale: 0, rotate: -45 }}
                                                animate={{ scale: 1, rotate: -12 }}
                                                className="absolute inset-0 flex items-center justify-center z-20"
                                            >
                                                <div className="bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-500 font-black text-[10px] px-2 py-0.5 rounded-md uppercase tracking-tighter opacity-70">
                                                    Verified
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="mt-4 text-center">
                                        <span className={cn(
                                            "block font-black text-[12px] uppercase tracking-tighter leading-tight",
                                            isLocked ? "text-slate-400" : "text-slate-800"
                                        )}>
                                            {day === 1 ? "Awal Hijrah" : `Hari Ke-${day}`}
                                        </span>
                                        <div className={cn(
                                            "text-[9px] font-black uppercase tracking-widest mt-1 px-3 py-1 rounded-full inline-block shadow-sm border",
                                            isLocked
                                                ? "bg-slate-100 text-slate-400 border-slate-200"
                                                : isCurrent
                                                    ? "bg-amber-50 text-amber-500 border-amber-200"
                                                    : "bg-emerald-50 text-emerald-500 border-emerald-200"
                                        )}>
                                            {isLocked ? (isPast ? "Telah Berlalu" : (openDate ? `Dibuka ${dateString}` : "Terkunci")) : progress === 100 ? "Selesai! ✨" : `${Math.round(progress)}% Selesai`}
                                        </div>
                                    </div>
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Immersive Mission Select */}
            <MissionSelect
                isOpen={missionSelectOpen}
                onClose={() => {
                    setMissionSelectOpen(false);
                    sounds?.play("close");
                }}
                onSelectAspect={(aspectId) => {
                    setSelectedAspectId(aspectId as MonitoringAspectId);
                    sounds?.play("select");
                }}
                day={selectedDay || 0}
                progress={currentDayProgress}
                logs={logs.filter(l => l.day === selectedDay)}
                tasks={tasks}
                isMidnight={isMidnight}
            />

            {/* Immersive Task Mission */}
            <TaskMission
                isOpen={!!selectedAspectId}
                onClose={() => {
                    setSelectedAspectId(null);
                    sounds?.play("close");
                }}
                day={selectedDay || activeDay}
                aspectId={selectedAspectId || ""}
                tasks={tasks.filter(t => t.aspectId === selectedAspectId && t.isActive)}
                logs={logs.filter(l => l.day === (selectedDay || activeDay) && l.aspect === selectedAspectId)}
                onSave={handleSaveTask}
                isMidnight={isMidnight}
            />

            {/* Daily Quest Intro Modal */}
            <AnimatePresence>
                {dailyQuestOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-emerald-950/80 backdrop-blur-md"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className={cn(
                                "rounded-[3rem] p-8 max-w-xs w-full text-center relative shadow-2xl transition-all duration-1000",
                                isMidnight ? "bg-slate-900 border border-slate-800" : "bg-white"
                            )}
                        >
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-24 w-24 bg-amber-400 rounded-full flex items-center justify-center shadow-xl shadow-amber-400/20 border-6 border-white">
                                <Trophy className="h-10 w-10 text-white" />
                            </div>
                            
                            <div className="mt-10">
                                <h2 className={cn("text-2xl font-black uppercase tracking-tighter leading-none mb-2", isMidnight ? "text-white" : "text-slate-800")}>Daily Quest!</h2>
                                <p className={cn("text-xs font-black uppercase tracking-widest mb-6 border-b-2 pb-4", isMidnight ? "text-slate-500 border-slate-800" : "text-slate-400 border-slate-50")}>Hari Ke-{clampedActiveDay}</p>
                                
                                <p className={cn("font-medium text-sm leading-relaxed mb-8", isMidnight ? "text-slate-400" : "text-slate-600")}>
                                    Selamat datang kembali, Pahlawan! Misimu hari ini telah menunggu. Jaga konsistensimu dan jangan biarkan api ketaatanmu padam! 🔥
                                </p>
                                
                                <button 
                                    onClick={() => setDailyQuestOpen(false)}
                                    className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-emerald-500/20 border-b-4 border-emerald-800 active:translate-y-1 active:border-b-0 transition-all hover:bg-emerald-500"
                                >
                                    AYO MULAI!
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Achievement Badges Modal */}
            <BadgesModal
                isOpen={badgesOpen}
                onClose={() => setBadgesOpen(false)}
                earnedBadges={earnedBadges}
                isMidnight={isMidnight}
            />
        </div>
    );
}

function BadgesModal({ isOpen, onClose, earnedBadges, isMidnight }: { isOpen: boolean, onClose: () => void, earnedBadges: string[], isMidnight: boolean }) {
    const badgeData = [
        { id: 'streak_3', name: 'Semangat Membara', icon: '🔥', desc: '3 Hari Istiqomah' },
        { id: 'streak_7', name: 'Pendekar Istiqomah', icon: '⚔️', desc: '7 Hari Istiqomah' },
        { id: 'streak_14', name: 'Legenda Hijrah', icon: '👑', desc: '14 Hari Penuh' },
        { id: 'perfect_day', name: 'Pahlawan Taqwa', icon: '🏆', desc: 'Selesai Semua Tugas' },
        { id: 'special_mission', name: 'Explorer Sejati', icon: '🌟', desc: 'Selesai Misi Spesial' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/80 backdrop-blur-md"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={cn(
                            "w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] p-8 pb-12 relative overflow-hidden shadow-2xl",
                            isMidnight ? "bg-slate-900 border-t border-slate-800" : "bg-white"
                        )}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className={cn("text-2xl font-black uppercase tracking-tighter leading-none", isMidnight ? "text-white" : "text-slate-800")}>
                                    Pencapaianmu
                                </h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 px-3 py-1 bg-slate-100 rounded-full inline-block">
                                    {earnedBadges.length} Terkoleksi
                                </p>
                            </div>
                            <button onClick={onClose} className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                <Trophy className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Badges Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {badgeData.map((badge) => {
                                const isEarned = earnedBadges.includes(badge.id);
                                return (
                                    <div
                                        key={badge.id}
                                        className={cn(
                                            "p-4 rounded-[2rem] border-2 transition-all flex flex-col items-center text-center gap-2",
                                            isEarned
                                                ? isMidnight ? "bg-indigo-500/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10" : "bg-amber-50 border-amber-200 shadow-lg shadow-amber-500/5"
                                                : isMidnight ? "bg-slate-800/50 border-slate-800 opacity-40 grayscale" : "bg-slate-50 border-slate-100 opacity-40 grayscale"
                                        )}
                                    >
                                        <div className={cn(
                                            "h-16 w-16 rounded-2xl flex items-center justify-center mb-1 text-3xl",
                                            isEarned ? "animate-bounce-slow" : ""
                                        )}>
                                            {badge.icon}
                                        </div>
                                        <div>
                                            <h4 className={cn("text-[11px] font-black uppercase tracking-tight", isMidnight ? "text-indigo-200" : "text-slate-800")}>
                                                {badge.name}
                                            </h4>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                                                {badge.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] border-b-4 border-slate-950 active:translate-y-1 active:border-b-0 transition-all"
                        >
                            KEMBALI KE PETUALANGAN
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
