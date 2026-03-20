"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart, User, Globe, Star, BookOpen,
    Loader2, Trophy, ChevronRight, LayoutGrid, Target,
    Cloud, Trees, Mountain, Wind, Lock,
    Anchor, Compass, Skull, Palmtree, Ship, Map as MapIcon, Gem
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MONITORING_ASPECTS, MonitoringAspectId } from "@/lib/constants/monitoring";
import TaskMission from "@/components/monitoring/TaskMission";
import MissionSelect from "@/components/monitoring/MissionSelect";
import { useAuth } from "@/components/providers/AuthProvider";
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
    const [currentDayProgress, setCurrentDayProgress] = useState(0);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                await Promise.all([fetchLogs(), fetchTasks(), fetchCurrentDay()]);
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
        const startDate = missionStartDate ? new Date(missionStartDate) : null;
        let openDate = null;
        if (startDate) {
            openDate = new Date(startDate);
            openDate.setDate(startDate.getDate() + (day - 1));
            openDate.setHours(0, 0, 0, 0);
        }

        const isLockedByDate = openDate && today < openDate;
        const isDemo = user?.id === "demo_santri";

        if (!isDemo && (day > activeDay || isLockedByDate)) {
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

    return (
        <div className="min-h-screen bg-[#F4EBD0] pb-32 font-sans selection:bg-amber-100 selection:text-amber-900 relative">
            {/* Texture Overlay */}
            <div className="fixed inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]" />

            {/* Header */}
            <div className="sticky top-0 z-30 bg-emerald-900 p-5 pb-10 text-center rounded-b-[2.5rem] shadow-xl relative overflow-hidden border-b-4 border-emerald-950/30">
                <motion.div
                    initial={{ scale: 0, rotate: -12 }}
                    animate={{ scale: 1, rotate: 12 }}
                    className="absolute -top-2 -right-2 text-white/10"
                >
                    <MapIcon className="h-32 w-32" />
                </motion.div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 mb-3">
                        <Trophy className="h-3 w-3 text-amber-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{Math.round(overallProgress)}% Selesai</span>
                    </div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter leading-none font-serif">
                        Peta Karunia
                    </h1>
                    <p className="text-emerald-100/60 text-[10px] font-bold uppercase tracking-widest mt-2">
                        Mencari Harta Taqwa
                    </p>
                </div>
            </div>

            {/* Interactive Journey Map */}
            <div className="relative mt-12 px-4 max-w-md mx-auto min-h-[1500px]">
                {/* Background Decorations */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Pirate Themed Decorations */}
                    <div className="absolute top-20 -left-10 opacity-10 rotate-12"><Anchor className="h-24 w-24 text-emerald-900" /></div>
                    <div className="absolute top-80 -right-5 opacity-10 -rotate-12"><Compass className="h-20 w-20 text-emerald-900" /></div>
                    <div className="absolute top-[400px] left-4 opacity-5"><Skull className="h-16 w-16 text-emerald-900" /></div>
                    <div className="absolute top-[700px] right-2 opacity-15"><Palmtree className="h-20 w-20 text-emerald-900" /></div>
                    <div className="absolute top-[1000px] left-10 opacity-5"><Ship className="h-20 w-20 text-emerald-900" /></div>
                    <div className="absolute top-[1300px] right-8 opacity-15"><MapIcon className="h-16 w-16 text-emerald-900" /></div>
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
                        stroke="#059669"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: activeDay / 14 }}
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

                        const startDate = missionStartDate ? new Date(missionStartDate) : null;
                        let openDate = null;
                        if (startDate) {
                            openDate = new Date(startDate);
                            openDate.setDate(startDate.getDate() + (day - 1));
                            openDate.setHours(0, 0, 0, 0);
                        }

                        const isLockedByDate = openDate && today < openDate;
                        const isLockedByAdmin = day > activeDay;
                        const isDemo = user?.id === "demo_santri";
                        const isLocked = !isDemo && (isLockedByDate || isLockedByAdmin);
                        const isCurrent = day === activeDay && !isLockedByDate;

                        const dateString = openDate ? openDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : "";

                        return (
                            <motion.div
                                key={day}
                                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", damping: 15 }}
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
                                            ? "bg-slate-200/50 border-slate-300/50"
                                            : isCurrent
                                                ? "bg-amber-400 border-amber-600 ring-[12px] ring-amber-400/20"
                                                : "bg-emerald-600 border-emerald-800 shadow-emerald-900/10"
                                    )}>
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
                                                <Lock className="h-8 w-8 text-[#5D4037]/40" />
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
                                            {isLocked ? (isLockedByDate ? `Dibuka ${dateString}` : "Terkunci") : progress === 100 ? "Selesai! ✨" : `${Math.round(progress)}% Selesai`}
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
            />
        </div>
    );
}
