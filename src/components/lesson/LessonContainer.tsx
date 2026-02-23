"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { X, Heart, Zap, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from 'canvas-confetti';
import { cn } from "@/lib/utils";
import { NodeType, Slide } from "@/lib/types";

// Slide Components
import StorySlide from "./StorySlide";
import QuizSlide from "./QuizSlide";
import ReciteSlide from "./ReciteSlide";
import ActionSlide from "./ActionSlide";
import ChecklistSlide from "./ChecklistSlide";
import PairMatchingSlide from "./PairMatchingSlide";
import SentenceArrangeSlide from "./SentenceArrangeSlide";
import MaterialSlide from "./MaterialSlide";
import AmalanSlide from "./AmalanSlide";
import SortingSlide from "./SortingSlide";
import TarteelSlide from "./TarteelSlide";
import FinalSubmitSlide from "./FinalSubmitSlide";

import { useGamification } from "@/context/GamificationContext";
import MascotToast from "../gamification/MascotToast";

export default function LessonContainer({
    lessonId,
    initialSlides
}: {
    lessonId: string,
    initialSlides?: Slide[]
}) {
    const router = useRouter();
    const { hearts, xp, streak, decrementHearts, addXp, completeNode } = useGamification();
    const [slideIndex, setSlideIndex] = useState(0);
    const [quizStreak, setQuizStreak] = useState(0);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [toast, setToast] = useState<{ message: string, pose: "success" | "cheer", isVisible: boolean }>({
        message: "",
        pose: "success",
        isVisible: false
    });

    const slides = useMemo(() => initialSlides || [], [initialSlides]);
    const quizSlidesCount = useMemo(() =>
        slides.filter(s => s.type === 'quiz' || s.type === 'sorting' || s.type === 'pair_matching').length,
        [slides]);
    const currentSlide = slides[slideIndex];

    // Grouping logic for the 6-stage progress bar
    const stages = useMemo(() => {
        const groups: { name: string, start: number, end: number }[] = [];
        let currentStage: any = null;

        slides.forEach((slide, idx) => {
            let stageName = "Materi";
            if (slide.id.includes("-pre-")) stageName = "Pre-test";
            else if (slide.type === 'material') stageName = "Materi";
            else if (slide.type === 'quiz' || slide.type === 'sorting') stageName = "Kuis";
            else if (slide.type === 'amalan') stageName = "Amalan";
            else if (slide.type === 'tarteel') stageName = "Tarteel";
            else if (slide.type === 'final_submit') stageName = "Submit";

            if (!currentStage || currentStage.name !== stageName) {
                if (currentStage) groups.push(currentStage);
                currentStage = { name: stageName, start: idx, end: idx };
            } else {
                currentStage.end = idx;
            }
        });
        if (currentStage) groups.push(currentStage);

        // Ensure we always have exactly 6 stages visually if possible, 
        // but here we follow the content.
        return groups;
    }, [slides]);

    const handleClose = () => router.push("/map");

    const playSound = (type: 'ding' | 'success' | 'error') => {
        const sounds = {
            ding: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
            success: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3",
            error: "https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3"
        };
        const audio = new Audio(sounds[type]);
        audio.volume = 0.3;
        audio.play().catch(() => { });
    };

    const handleNext = () => {
        if (slideIndex < slides.length - 1) {
            playSound('ding');
            setSlideIndex(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (slideIndex > 0) {
            playSound('ding');
            setSlideIndex(prev => prev - 1);
        }
    };

    const handleQuizAnswer = (isCorrect: boolean) => {
        if (!isCorrect) {
            playSound('error');
            decrementHearts();
            setQuizStreak(0);
        } else {
            playSound('success');
            setCorrectAnswersCount(prev => prev + 1);
            const newStreak = quizStreak + 1;
            setQuizStreak(newStreak);

            // Milestone rewards
            if (newStreak === 3) {
                addXp(50);
                setToast({
                    message: "Luar Biasa! 3 Benar Berurutan! 🔥 +50 XP",
                    pose: "cheer",
                    isVisible: true
                });
            } else if (newStreak === 5) {
                addXp(100);
                setToast({
                    message: "Menakjubkan! 5 Benar Berurutan! ⚡ +100 XP",
                    pose: "cheer",
                    isVisible: true
                });
            }
        }
        handleNext();
    };

    const handleFinalComplete = () => {
        let finalBonus = 0;

        // Perfect score bonus
        if (correctAnswersCount === quizSlidesCount && quizSlidesCount > 0) {
            finalBonus += 200;
            // Confetti for perfect score
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        addXp(100 + finalBonus);
        completeNode(lessonId);
    };

    if (!currentSlide) return null;

    const currentStageInfo = stages.find(s => slideIndex >= s.start && slideIndex <= s.end);
    const stageIndex = stages.indexOf(currentStageInfo!) + 1;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#FDFCF6]">
            {/* Header / Premium Progress Bar */}
            <div className="px-4 pt-6 pb-2 max-w-5xl mx-auto w-full">
                <div className="flex items-center gap-4 md:gap-8 mb-6">
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: -90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleClose}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-2xl shadow-sm border-2 border-slate-50"
                    >
                        <X className="h-6 w-6 stroke-[3]" />
                    </motion.button>

                    {/* Multi-segment Segmented Progress Bar */}
                    <div className="flex-1 flex gap-2 h-4 items-center">
                        {stages.map((stage, idx) => {
                            const isPast = slideIndex > stage.end;
                            const isActive = slideIndex >= stage.start && slideIndex <= stage.end;
                            const progress = isActive
                                ? ((slideIndex - stage.start + 1) / (stage.end - stage.start + 1)) * 100
                                : isPast ? 100 : 0;

                            return (
                                <div key={idx} className="flex-1 h-full bg-slate-100/50 rounded-full relative overflow-hidden border-2 border-white shadow-inner">
                                    <motion.div
                                        initial={false}
                                        animate={{ width: `${progress}%` }}
                                        className={cn(
                                            "absolute inset-0 transition-colors duration-700",
                                            isPast || isActive ? 'bg-emerald-500' : 'bg-slate-200'
                                        )}
                                    />
                                    {isActive && (
                                        <motion.div
                                            animate={{ opacity: [0.2, 0.5, 0.2], x: ["-100%", "100%"] }}
                                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-4">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border-2 border-slate-50 shadow-sm"
                        >
                            <Heart className={cn("h-5 w-5", hearts > 0 ? "text-red-500 fill-red-500" : "text-slate-200 fill-slate-200")} />
                            <span className="font-black text-slate-700 text-sm">{hearts}</span>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border-2 border-slate-50 shadow-sm"
                        >
                            <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
                            <span className="font-black text-slate-700 text-sm">{streak}</span>
                        </motion.div>
                    </div>
                </div>

                {/* Stage Indicator */}
                <div className="flex justify-start">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStageInfo?.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-emerald-500 text-white px-4 py-1.5 rounded-2xl border-4 border-emerald-400 shadow-lg shadow-emerald-100 flex items-center gap-2"
                        >
                            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                TAHAP {stageIndex}: {currentStageInfo?.name}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto relative flex flex-col pt-4 pb-20 no-scrollbar">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide.id}
                        initial={{ opacity: 0, x: 50, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 150 }}
                        className="flex-1 w-full max-w-4xl mx-auto px-6"
                    >
                        {currentSlide.type === 'story' && <StorySlide data={currentSlide.content} />}
                        {currentSlide.type === 'quiz' && <QuizSlide data={currentSlide.content} onAnswer={handleQuizAnswer} />}
                        {currentSlide.type === 'recite' && <ReciteSlide data={currentSlide.content} onComplete={() => handleNext()} />}
                        {currentSlide.type === 'action' && <ActionSlide data={currentSlide.content} onComplete={() => handleNext()} />}
                        {currentSlide.type === 'checklist' && <ChecklistSlide data={currentSlide.content} onComplete={() => handleNext()} />}
                        {currentSlide.type === 'pair_matching' && <PairMatchingSlide data={currentSlide.content} onComplete={handleQuizAnswer} />}
                        {currentSlide.type === 'sentence_arrange' && <SentenceArrangeSlide data={currentSlide.content} onComplete={() => handleNext()} />}
                        {currentSlide.type === 'material' && <MaterialSlide data={currentSlide.content} onComplete={handleNext} />}
                        {currentSlide.type === 'amalan' && <AmalanSlide data={currentSlide.content} onComplete={() => handleNext()} />}
                        {currentSlide.type === 'sorting' && <SortingSlide data={currentSlide.content} onComplete={() => handleNext()} />}
                        {currentSlide.type === 'tarteel' && <TarteelSlide data={currentSlide.content} onComplete={() => handleNext()} />}
                        {currentSlide.type === 'final_submit' && <FinalSubmitSlide lessonId={lessonId} onComplete={handleFinalComplete} />}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Footer Navigation */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-[#FDFCF6] via-[#FDFCF6]/90 to-transparent">
                <div className="max-w-4xl mx-auto w-full flex justify-between items-center">
                    {slideIndex > 0 && currentSlide.type !== 'final_submit' ? (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleBack}
                            className="flex items-center gap-2 text-slate-400 font-black text-xs hover:text-emerald-600 transition-all px-5 py-3 rounded-2xl bg-white border-2 border-slate-50 shadow-sm"
                        >
                            <ChevronLeft className="h-4 w-4 stroke-[3]" /> KEMBALI
                        </motion.button>
                    ) : <div />}

                    {/* Auto-continue hints for story slides */}
                    {currentSlide.type === 'story' && (
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleNext}
                            className="px-8 py-4 bg-emerald-500 text-white font-black rounded-[2rem] shadow-xl shadow-emerald-200 uppercase tracking-widest text-xs border-b-4 border-emerald-600 active:border-b-0 transition-all"
                        >
                            LANJUTKAN
                        </motion.button>
                    )}
                </div>
            </div>
            {/* Mascot Toast for Streaks */}
            <MascotToast
                isVisible={toast.isVisible}
                message={toast.message}
                pose={toast.pose}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
        </div>
    );
}
