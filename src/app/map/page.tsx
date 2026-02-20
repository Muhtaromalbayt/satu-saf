"use client";

import { useState, useEffect } from "react";
import PathCanvas from "@/components/map/PathCanvas";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Lock, Flame, Heart, Zap } from "lucide-react";
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

    // Check if previous chapter is completed to unlock next
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

    // Determine if the CURRENT view is locked
    const currentStatus = chapterStatus[activeChapter.id] || 'pending';
    const isActuallyUnlocked = isChapterUnlocked(activeChapterIndex);
    const isCurrentChapterLocked = !isActuallyUnlocked;

    const allNodesCompleted = activeChapter.nodes.every(node => completedNodes.includes(node.id));
    const canSubmit = allNodesCompleted && currentStatus === 'pending';
    const isSubmitted = currentStatus === 'submitted';
    const isApproved = currentStatus === 'approved';

    return (
        <div className="flex flex-col items-center min-h-screen bg-slate-50 pb-24 relative overflow-hidden">
            {/* Parallax Background Glow */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,106,79,0.05),transparent)] pointer-events-none" />

            <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 shadow-sm">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-orange-50 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 border border-orange-100 cursor-pointer"
                        >
                            <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
                            <span className="font-black text-orange-600">{streak}</span>
                        </motion.div>
                        <div className="bg-red-50 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 border border-red-100 cursor-pointer">
                            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                            <span className="font-black text-red-600">{hearts}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                        <Zap className="h-4 w-4 text-primary fill-primary" />
                        <span className="font-black text-primary text-sm tracking-tight">{xp} XP</span>
                    </div>
                </div>
            </header>

            {/* Chapter Header / Pagination */}
            <div className="mt-20 z-40 w-full p-4">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePrev}
                        disabled={activeChapterIndex === 0}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>

                    <div className="flex flex-col items-center">
                        <h2 className="text-sm font-bold text-muted-foreground tracking-widest uppercase">
                            Chapter {activeChapterIndex + 1}
                        </h2>
                        <h1 className="text-lg font-bold text-primary truncate max-w-[200px]">
                            {activeChapter.title.split(":")[1] || activeChapter.title}
                        </h1>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNext}
                        disabled={activeChapterIndex >= chapters.length - 1}
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                </div>
            </div>

            {/* Description */}
            <div className="w-full max-w-md p-6 text-center">
                <p className="text-muted-foreground">{activeChapter.description}</p>
            </div>

            {/* Content */}
            <div className="w-full relative min-h-[500px] max-w-md">
                {isCurrentChapterLocked ? (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm p-8 text-center animate-in fade-in zoom-in duration-300">
                        <div className="mb-6 p-6 bg-slate-100 rounded-full">
                            <Lock className="h-12 w-12 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-600 mb-2">Chapter Terkunci</h3>
                        <p className="text-muted-foreground">Selesaikan dan dapatkan *approval* Chapter {activeChapterIndex} untuk membuka bab ini.</p>
                    </div>
                ) : isSubmitted ? (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/10 backdrop-blur-[2px] p-8 text-center">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200"
                        >
                            <div className="inline-flex p-4 bg-orange-100 rounded-full mb-4">
                                <Clock className="h-8 w-8 text-orange-600 animate-pulse" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Menunggu Persetujuan</h3>
                            <p className="text-slate-500 text-sm">Prgresmu sedang ditinjau oleh Mentor. Sabar ya!</p>
                        </motion.div>
                    </div>
                ) : isApproved ? (
                    <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-xs shadow-lg">
                        <CheckCircle2 className="h-4 w-4" />
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
                        className="fixed bottom-24 inset-x-4 z-50 flex justify-center"
                    >
                        <Button
                            onClick={() => setIsCompletionModalOpen(true)}
                            className="w-full max-w-sm py-8 bg-green-600 hover:bg-green-700 text-white font-black text-xl rounded-2xl shadow-[0_8px_0_rgb(21,128,61)] transition-all active:translate-y-1 active:shadow-none uppercase tracking-wider flex items-center justify-center gap-3"
                        >
                            <CheckCircle2 className="h-6 w-6" />
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
