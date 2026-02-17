"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Heart, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from 'canvas-confetti';
import { cn } from "@/lib/utils";
import { NodeType, Slide } from "@/lib/types";
import StorySlide from "./StorySlide";
import QuizSlide from "./QuizSlide";
import ReciteSlide from "./ReciteSlide";
import ActionSlide from "./ActionSlide";
import ChecklistSlide from "./ChecklistSlide";
import PairMatchingSlide from "./PairMatchingSlide";
import LessonSummary from "./LessonSummary";
import HeartRecoverySlide from "./HeartRecoverySlide";
import FeedbackModal from "./FeedbackModal";
import { useSound } from "@/hooks/useSound";
import { useGamification } from "@/context/GamificationContext";

// Mock data generator
import { LESSON_CONTENT } from "@/data/mockData";

const getMockSlides = (type: NodeType, lessonId: string): Slide[] => {
    // 1. Try to find specific content for this lessonId
    if (LESSON_CONTENT[lessonId]) {
        return LESSON_CONTENT[lessonId];
    }

    // 2. Fallback to generic content based on type if specific content missing
    if (type === 'story') {
        return [
            { id: 's1', type: 'story', content: { title: "Materi", text: "Konten materi belum tersedia untuk bab ini.", image: "Illustration 1" } },
        ];
    } else if (type === 'quiz' || type === 'challenge') {
        return [
            { id: 'q1', type: 'quiz', content: { question: "Contoh Pertanyaan?", options: ["A", "B", "C", "D"], correctIndex: 0 } },
        ];
    } else if (type === 'recite') {
        return [
            { id: 'r1', type: 'recite', content: { surahName: "Al-Fatihah", verseText: "Bismillah", targetString: "Bismillah" } }
        ];
    } else if (type === 'action') {
        return [
            { id: 'a1', type: 'action', content: { title: "Misi Harian", description: "Lakukan kebaikan hari ini." } }
        ];
    } else if (type === 'checklist') {
        return [
            {
                id: 'ch1',
                type: 'checklist',
                content: {
                    title: "Amalan Yaumi",
                    items: [
                        { id: 'sholat', label: 'Sholat Berjamaah', description: 'Tepat waktu di masjid' },
                        { id: 'tilawah', label: 'Tilawah Al-Quran' },
                        { id: 'dzikir', label: 'Dzikir Pagi/Petang' },
                        { id: 'akhlak', label: 'Menjaga Akhlak' }
                    ]
                }
            }
        ];
    }
    return [{ id: 'default', type: 'story', content: { title: "Loading...", text: "Content coming soon." } }];
};

import MascotToast from "../gamification/MascotToast";

export default function LessonContainer({ lessonId, type }: { lessonId: string, type: NodeType }) {
    const router = useRouter();
    const { hearts, xp, streak, decrementHearts, addXp, completeNode, addOneHeart } = useGamification();
    const [slideIndex, setSlideIndex] = useState(0);
    const [showSummary, setShowSummary] = useState(false);
    const [isRecovering, setIsRecovering] = useState(false);
    const [heartShake, setHeartShake] = useState(false);
    const [showFeedback, setShowFeedback] = useState<{ open: boolean, type: 'success' | 'heart_lost', message: string }>({ open: false, type: 'success', message: '' });
    const [sessionStreak, setSessionStreak] = useState(0);
    const [showMascotToast, setShowMascotToast] = useState<{
        visible: boolean;
        message: string;
        pose?: "success" | "cheer" | "thinking" | "idle";
    }>({
        visible: false,
        message: '',
        pose: 'success'
    });
    const { playSound } = useSound();

    // Initial fetch of slides
    const [slides] = useState(() => getMockSlides(type, lessonId));
    const currentSlide = slides[slideIndex];

    const progress = ((slideIndex + 1) / (slides.length || 1)) * 100;

    const handleClose = () => {
        router.push("/map");
    };

    const handleNext = () => {
        if (slideIndex < slides.length - 1) {
            setSlideIndex(prev => prev + 1);
        } else {
            // Show summary and trigger confetti
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#1B4332', '#FFB703', '#FDFCF6', '#2D6A4F']
            });
            addXp(50);
            completeNode(lessonId);
            setShowSummary(true);
        }
    };

    const handleFinish = () => {
        router.push("/map");
    };

    const handleQuizAnswer = (isCorrect: boolean) => {
        if (!isCorrect) {
            playSound('incorrect');
            setHeartShake(true);
            setTimeout(() => setHeartShake(false), 500);
            decrementHearts();
            setShowFeedback({ open: true, type: 'heart_lost', message: 'Hati-hati, periksa kembali jawabanmu!' });
        } else {
            playSound('correct');
            setShowFeedback({ open: true, type: 'success', message: 'Jawabanmu benar! Pertahankan!' });
        }
    };

    if (hearts === 0 && !isRecovering) {
        return (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background p-8 text-center space-y-6">
                <div className="relative">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <Heart className="h-24 w-24 text-slate-300 fill-current" />
                    </motion.div>
                    <X className="h-10 w-10 text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-slate-800">Yah, hatimu habis!</h1>
                    <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
                        Jangan menyerah! Bacalah ayat Al-Quran untuk mendapatkan tambahan hati.
                    </p>
                </div>
                <div className="w-full space-y-3 pt-4 max-w-xs">
                    <button
                        onClick={() => setIsRecovering(true)}
                        className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg hover:bg-primary/90 flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="h-5 w-5" />
                        PULIHKAN DENGAN AYAT
                    </button>
                    <button
                        onClick={() => router.push("/map")}
                        className="w-full py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-colors"
                    >
                        KEMBALI KE MAP
                    </button>
                </div>
            </div>
        );
    }

    if (isRecovering) {
        return (
            <div className="fixed inset-0 z-[100] flex flex-col bg-background">
                <div className="p-4 border-b flex items-center justify-between">
                    <button onClick={() => setIsRecovering(false)}>
                        <X className="h-6 w-6" />
                    </button>
                    <span className="font-bold text-slate-600">Recovery Mode</span>
                    <div className="w-6" />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                    <HeartRecoverySlide
                        onComplete={() => {
                            addOneHeart();
                            setIsRecovering(false);
                        }}
                        onCancel={() => setIsRecovering(false)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-background">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <button onClick={handleClose}>
                    <X className="h-6 w-6 text-muted-foreground" />
                </button>
                {!showSummary && (
                    <div className="flex-1 mx-4 h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            className="h-full bg-primary rounded-full transition-all duration-300"
                        />
                    </div>
                )}
                <motion.div
                    animate={heartShake ? { x: [-5, 5, -5, 5, 0], scale: [1, 1.2, 1] } : {}}
                    className="flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-2xl border border-red-100"
                >
                    <Heart className={cn("h-5 w-5", hearts > 0 ? "text-red-500 fill-red-500" : "text-slate-300 fill-slate-300")} />
                    <span className={cn("font-black text-lg", hearts > 0 ? "text-red-600" : "text-slate-400")}>
                        {hearts}
                    </span>
                </motion.div>
            </div>

            <MascotToast
                isVisible={showMascotToast.visible}
                message={showMascotToast.message}
                pose={showMascotToast.pose}
                onClose={() => setShowMascotToast(prev => ({ ...prev, visible: false }))}
            />

            <FeedbackModal
                isOpen={showFeedback.open}
                type={showFeedback.type}
                message={showFeedback.message}
                onClose={() => setShowFeedback(prev => ({ ...prev, open: false }))}
            />

            {/* Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {showSummary ? (
                        <motion.div
                            key="summary"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="w-full flex flex-col items-center"
                        >
                            <LessonSummary
                                xp={50}
                                hearts={hearts}
                                streak={streak}
                                onFinish={handleFinish}
                            />
                        </motion.div>
                    ) : (
                        currentSlide && (
                            <motion.div
                                key={slideIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="w-full flex flex-col items-center"
                            >
                                {currentSlide.type === 'story' && <StorySlide data={currentSlide.content} />}
                                {currentSlide.type === 'quiz' && <QuizSlide data={currentSlide.content} onAnswer={handleQuizAnswer} />}
                                {currentSlide.type === 'recite' && <ReciteSlide data={currentSlide.content} onComplete={(success) => console.log(success)} />}
                                {currentSlide.type === 'action' && <ActionSlide data={currentSlide.content} onComplete={(data) => console.log(data)} />}
                                {currentSlide.type === 'checklist' && <ChecklistSlide data={currentSlide.content} onComplete={(data) => console.log(data)} />}
                                {currentSlide.type === 'pair_matching' && <PairMatchingSlide data={currentSlide.content} onComplete={(success) => console.log(success)} />}
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            {!showSummary && (
                <div className="p-4 border-t bg-background">
                    <button
                        onClick={handleNext}
                        className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-lg transition-transform active:scale-95 uppercase tracking-wider"
                    >
                        {slideIndex >= slides.length - 1 ? "Finish" : "Continue"}
                    </button>
                </div>
            )}
        </div>
    );
}
