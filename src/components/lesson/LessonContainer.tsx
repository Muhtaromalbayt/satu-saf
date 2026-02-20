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
    const [showMascotToast] = useState({
        visible: false,
        message: '',
        pose: 'success'
    });

    const slides = useMemo(() => initialSlides || [], [initialSlides]);
    const currentSlide = slides[slideIndex];

    // Grouping logic for the 6-stage progress bar
    const stages = useMemo(() => {
        const groups: { name: string, start: number, end: number }[] = [];
        let currentStage: any = null;

        slides.forEach((slide, idx) => {
            let stageName = "Other";
            if (slide.id.includes("-pre-")) stageName = "Pre-test";
            else if (slide.id.includes("-mat-")) stageName = "Materi";
            else if (slide.id.includes("-quiz-") || slide.type === 'sorting') stageName = "Kuis";
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
        if (slideIndex > 0) setSlideIndex(prev => prev - 1);
    };

    const handleQuizAnswer = (isCorrect: boolean) => {
        if (!isCorrect) {
            playSound('error');
            decrementHearts();
        } else {
            playSound('success');
            handleNext();
        }
    };

    const handleFinalComplete = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#f59e0b', '#ffffff']
        });
        addXp(100);
        completeNode(lessonId);
    };

    if (!currentSlide) return null;

    const currentStageInfo = stages.find(s => slideIndex >= s.start && slideIndex <= s.end);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white">
            {/* Header / Premium Progress Bar */}
            <div className="px-6 pt-8 pb-4 max-w-5xl mx-auto w-full">
                <div className="flex items-center gap-6 mb-6">
                    <button
                        onClick={handleClose}
                        className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="h-7 w-7" />
                    </button>

                    {/* Multi-segment Segmented Progress Bar */}
                    <div className="flex-1 flex gap-2 h-3.5 items-center">
                        {stages.map((stage, idx) => {
                            const isPast = slideIndex > stage.end;
                            const isActive = slideIndex >= stage.start && slideIndex <= stage.end;
                            const progress = isActive
                                ? ((slideIndex - stage.start + 1) / (stage.end - stage.start + 1)) * 100
                                : isPast ? 100 : 0;

                            return (
                                <div key={idx} className="flex-1 h-full bg-slate-100 rounded-full relative overflow-hidden ring-1 ring-slate-100">
                                    <motion.div
                                        initial={false}
                                        animate={{ width: `${progress}%` }}
                                        className={cn(
                                            "absolute inset-0 transition-colors duration-500",
                                            isPast || isActive ? 'bg-emerald-500' : 'bg-slate-200'
                                        )}
                                    />
                                    {isActive && (
                                        <motion.div
                                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute inset-0 bg-white"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-5 ml-2">
                        <div className="flex items-center gap-1.5">
                            <Heart className={cn("h-7 w-7", hearts > 0 ? "text-red-500 fill-red-500" : "text-slate-300 fill-slate-300")} />
                            <span className="font-black text-slate-700 text-xl">{hearts}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Zap className="h-7 w-7 text-amber-400 fill-amber-400" />
                            <span className="font-black text-slate-700 text-xl">{streak}</span>
                        </div>
                    </div>
                </div>

                {/* Stage Indicator */}
                <div className="flex justify-start">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStageInfo?.name}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-emerald-50 px-4 py-1.5 rounded-2xl border-2 border-emerald-100/50"
                        >
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                STAGE {stages.indexOf(currentStageInfo!) + 1}: {currentStageInfo?.name}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <MascotToast
                isVisible={showMascotToast.visible}
                message={showMascotToast.message}
                pose={showMascotToast.pose as any}
                onClose={() => { }}
            />

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto relative flex flex-col pt-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide.id}
                        initial={{ opacity: 0, x: 40, scale: 0.98 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -40, scale: 0.98 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="flex-1 w-full max-w-4xl mx-auto px-6"
                    >
                        {currentSlide.type === 'story' && <StorySlide data={currentSlide.content} />}
                        {currentSlide.type === 'quiz' && <QuizSlide data={currentSlide.content} onAnswer={handleQuizAnswer} />}
                        {currentSlide.type === 'recite' && <ReciteSlide data={currentSlide.content} onComplete={() => handleNext()} />}
                        {currentSlide.type === 'action' && <ActionSlide data={currentSlide.content} onComplete={() => handleNext()} />}
                        {currentSlide.type === 'checklist' && <ChecklistSlide data={currentSlide.content} onComplete={() => handleNext()} />}
                        {currentSlide.type === 'pair_matching' && <PairMatchingSlide data={currentSlide.content} onComplete={() => handleNext()} />}
                        {currentSlide.type === 'sentence_arrange' && <SentenceArrangeSlide data={currentSlide.content} onComplete={() => handleNext()} />}
                        {currentSlide.type === 'material' && <MaterialSlide data={currentSlide.content} onComplete={handleNext} />}
                        {currentSlide.type === 'amalan' && <AmalanSlide data={currentSlide.content} onComplete={() => handleNext()} />}
                        {currentSlide.type === 'sorting' && <SortingSlide data={currentSlide.content} onComplete={() => handleNext()} />}
                        {currentSlide.type === 'tarteel' && <TarteelSlide data={currentSlide.content} onComplete={() => handleNext()} />}
                        {currentSlide.type === 'final_submit' && <FinalSubmitSlide lessonId={lessonId} onComplete={handleFinalComplete} />}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Footer / Navigation Support */}
            <div className="p-6 max-w-4xl mx-auto w-full flex justify-between items-center">
                {slideIndex > 0 && currentSlide.type !== 'final_submit' ? (
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-slate-400 font-black text-sm hover:text-slate-600 transition-all px-4 py-2 rounded-xl hover:bg-slate-50"
                    >
                        <ChevronLeft className="h-5 w-5" /> KEMBALI
                    </button>
                ) : <div />}

                {/* Optional "Continue" button for types that don't have built-in completion buttons */}
                {(currentSlide.type === 'story' || currentSlide.type === 'material') && (
                    <button
                        onClick={handleNext}
                        className="px-8 py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-100 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm"
                    >
                        LANJUTKAN
                    </button>
                )}
            </div>
        </div>
    );
}
