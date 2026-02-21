"use client";

import { useState, useEffect } from "react";
import PathCanvas from "@/components/map/PathCanvas";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Lock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGamification } from "@/context/GamificationContext";
import StreakPopup from "@/components/gamification/StreakPopup";
import { motion, AnimatePresence } from "framer-motion";
import ChapterFinishModal from "@/components/map/ChapterFinishModal";
import { CheckCircle2, Clock } from "lucide-react";
import { Chapter } from "@/lib/types";

export default function MapPage() {
    const { hearts, xp, streak, completedNodes, chapterStatus, submitChapter } = useGamification();
    const [chapters, setChapters] = useState<Chapter[] | null>(null);
    const [activeChapterIndex, setActiveChapterIndex] = useState(0);
    const [showStreak, setShowStreak] = useState(false);
    const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const res = await fetch("/api/chapters");
                const data = await res.json();
                setChapters(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch chapters:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchChapters();
    }, []);

    useEffect(() => {
        const hasSeenStreak = sessionStorage.getItem('hasSeenStreak');
        if (!hasSeenStreak && streak > 0) {
            setShowStreak(true);
            sessionStorage.setItem('hasSeenStreak', 'true');
        }
    }, [streak]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!chapters || chapters.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
                <h1 className="text-2xl font-black text-slate-800 mb-2">Belum ada materi pelajaran</h1>
                <p className="text-slate-500 mb-6">Hubungi admin untuk menambahkan materi baru.</p>
                <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
            </div>
        );
    }

    const activeChapter = chapters[activeChapterIndex] || chapters[0];

    const isChapterUnlocked = (index: number) => {
        if (index === 0) return true;
        const prevChapter = chapters[index - 1];
        return chapterStatus[prevChapter.id] === 'approved' || chapterStatus[prevChapter.id] === 'submitted';
    };

    const handleNext = () => {
        if (activeChapterIndex < chapters.length - 1) {
            setActiveChapterIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (activeChapterIndex > 0) {
            setActiveChapterIndex(prev => prev - 1);
        }
    };

    const currentStatus = chapterStatus[activeChapter.id] || 'pending';
    const isActuallyUnlocked = isChapterUnlocked(activeChapterIndex);
    const isCurrentChapterLocked = !isActuallyUnlocked;

    const allNodesCompleted = activeChapter.nodes.every(node => completedNodes.includes(node.id));
    const canSubmit = allNodesCompleted && currentStatus === 'pending';
    const isSubmitted = currentStatus === 'submitted';
    const isApproved = currentStatus === 'approved';

    return (
        <div className="flex flex-col items-center min-h-screen bg-slate-50 pb-28 relative overflow-hidden">
            {/* Parallax Background Glow */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,106,79,0.05),transparent)] pointer-events-none" />

            {/* Chapter Header / Pagination — replaces duplicate header */}
            <div className="z-40 w-full p-3">
                <div className="flex items-center justify-between max-w-lg mx-auto">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePrev}
                        disabled={activeChapterIndex === 0}
                        className="h-9 w-9"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <div className="flex flex-col items-center">
                        <h2 className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
                            Chapter {activeChapterIndex + 1}
                        </h2>
                        <h1 className="text-base font-bold text-primary truncate max-w-[220px]">
                            {activeChapter.title.split(":")[1] || activeChapter.title}
                        </h1>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNext}
                        disabled={activeChapterIndex >= chapters.length - 1}
                        className="h-9 w-9"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>

                {/* XP inline badge */}
                <div className="flex justify-center mt-1">
                    <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        <Zap className="h-3.5 w-3.5 text-primary fill-primary" />
                        <span className="font-black text-primary text-xs tracking-tight">{xp} XP</span>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="w-full max-w-lg px-5 py-2 text-center">
                <p className="text-muted-foreground text-sm">{activeChapter.description}</p>
            </div>

            {/* Content */}
            <div className="w-full relative min-h-[500px] max-w-lg">
                {isCurrentChapterLocked ? (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm p-6 text-center animate-in fade-in zoom-in duration-300">
                        <div className="mb-4 p-5 bg-slate-100 rounded-full">
                            <Lock className="h-10 w-10 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-600 mb-1.5">Chapter Terkunci</h3>
                        <p className="text-muted-foreground text-sm">Selesaikan dan dapatkan *approval* Chapter {activeChapterIndex} untuk membuka bab ini.</p>
                    </div>
                ) : isSubmitted ? (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/10 backdrop-blur-[2px] p-6 text-center">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200"
                        >
                            <div className="inline-flex p-3 bg-orange-100 rounded-full mb-3">
                                <Clock className="h-7 w-7 text-orange-600 animate-pulse" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1.5">Menunggu Persetujuan</h3>
                            <p className="text-slate-500 text-xs">Progresmu sedang ditinjau oleh Mentor. Sabar ya!</p>
                        </motion.div>
                    </div>
                ) : isApproved ? (
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-green-500 text-white px-3 py-1.5 rounded-full font-bold text-[10px] shadow-lg">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        APPROVED
                    </div>
                ) : null}

                <div className={cn("transition-opacity duration-500", (isCurrentChapterLocked || isSubmitted) ? "opacity-20 blur-sm pointer-events-none" : "opacity-100")}>
                    <PathCanvas chapters={[activeChapter]} />
                </div>
            </div>

            {/* Finish Chapter Button */}
            <AnimatePresence>
                {canSubmit && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-28 inset-x-4 z-50 flex justify-center"
                    >
                        <Button
                            onClick={() => setIsCompletionModalOpen(true)}
                            className="w-full max-w-sm py-6 bg-green-600 hover:bg-green-700 text-white font-black text-lg rounded-2xl shadow-[0_6px_0_rgb(21,128,61)] transition-all active:translate-y-1 active:shadow-none uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 className="h-5 w-5" />
                            SELESAIKAN CHAPTER
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            <ChapterFinishModal
                isOpen={isCompletionModalOpen}
                chapterTitle={activeChapter.title}
                onClose={() => setIsCompletionModalOpen(false)}
                onSubmit={() => {
                    submitChapter(activeChapter.id);
                    setIsCompletionModalOpen(false);
                }}
            />

            {showStreak && (
                <StreakPopup streak={streak} onClose={() => setShowStreak(false)} />
            )}
        </div>
    );
}
