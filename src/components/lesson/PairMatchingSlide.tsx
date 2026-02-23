"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, PartyPopper, Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Pair {
    id: string;
    left: string;
    right: string; // The matching pair
}

interface PairMatchingSlideProps {
    data: {
        title: string;
        pairs: Pair[];
    };
    onComplete: (success: boolean) => void;
}

export default function PairMatchingSlide({ data, onComplete }: PairMatchingSlideProps) {
    // We need to shuffle the right side to make it a puzzle
    // But keep track of their original pair IDs
    const [leftDisplay, setLeftDisplay] = useState<{ id: string, text: string }[]>([]);
    const [rightDisplay, setRightDisplay] = useState<{ id: string, text: string }[]>([]);

    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [selectedRight, setSelectedRight] = useState<string | null>(null);
    const [errorPair, setErrorPair] = useState<string | null>(null);

    const [timeLeft, setTimeLeft] = useState(45);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    // Initial Setup
    useEffect(() => {
        const totalPairs = data.pairs;
        // Ensure at least one pair is held back for rotation
        const boardSize = Math.min(totalPairs.length - 1, 5);
        const shuffled = [...totalPairs].sort(() => Math.random() - 0.5);

        const initialBoard = shuffled.slice(0, boardSize);

        // Shuffle left and right independently for the board
        const initialLeft = [...initialBoard].map(p => ({ id: p.id, text: p.left })).sort(() => Math.random() - 0.5);
        const initialRight = [...initialBoard].map(p => ({ id: p.id, text: p.right })).sort(() => Math.random() - 0.5);

        setLeftDisplay(initialLeft);
        setRightDisplay(initialRight);
    }, [data.pairs]);

    // Timer logic
    useEffect(() => {
        if (isFinished) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsFinished(true);
                    setTimeout(() => onComplete(true), 1500);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isFinished, onComplete]);

    const handleLeftClick = (id: string) => {
        if (isFinished) return;
        setSelectedLeft(id);
        setErrorPair(null);
        if (selectedRight) checkMatch(id, selectedRight);
    };

    const handleRightClick = (id: string) => {
        if (isFinished) return;
        setSelectedRight(id);
        setErrorPair(null);
        if (selectedLeft) checkMatch(selectedLeft, id);
    };

    const checkMatch = (leftId: string, rightId: string) => {
        if (leftId === rightId) {
            // Match Found!
            setScore(s => s + 1);

            // Replacement logic:
            // Find current IDs on board (excluding the one just matched)
            const remainingIds = leftDisplay.filter(item => item.id !== leftId).map(item => item.id);

            // Candidates: Pairs NOT on board and NOT the one just matched
            let candidates = data.pairs.filter(p => !remainingIds.includes(p.id) && p.id !== leftId);

            // If candidates are empty (shouldn't happen with our boardSize logic), just use all excluding remaining board
            if (candidates.length === 0) {
                candidates = data.pairs.filter(p => !remainingIds.includes(p.id));
            }

            const nextPair = candidates[Math.floor(Math.random() * candidates.length)];

            // Replace both sides with the *same* new pair content at the old slots
            setLeftDisplay(prev => prev.map(item => item.id === leftId ? { id: nextPair.id, text: nextPair.left } : item));
            setRightDisplay(prev => prev.map(item => item.id === rightId ? { id: nextPair.id, text: nextPair.right } : item));

            setSelectedLeft(null);
            setSelectedRight(null);
        } else {
            // Mismatch
            setErrorPair(`${leftId}-${rightId}`);
            setSelectedLeft(null);
            setSelectedRight(null);
            // Visual feedback handled by errorPair state
            setTimeout(() => setErrorPair(null), 500);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center space-y-6">
            <div className="w-full flex justify-between items-center bg-white/80 backdrop-blur-md p-4 md:p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="flex flex-col items-start gap-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Waktu</span>
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "w-3 h-3 rounded-full",
                            timeLeft > 15 ? "bg-emerald-500" : timeLeft > 5 ? "bg-amber-500" : "bg-red-500 animate-ping"
                        )} />
                        <span className={cn(
                            "text-3xl font-black tabular-nums tracking-tighter",
                            timeLeft <= 10 ? "text-red-500" : "text-emerald-600"
                        )}>{timeLeft}s</span>
                    </div>
                </div>

                <h2 className="text-xl font-black text-slate-800 hidden md:block uppercase tracking-tight">
                    {data.title}
                </h2>

                <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Skor</span>
                    <div className="flex items-center gap-3 bg-amber-50 px-5 py-2 rounded-2xl border-2 border-amber-100">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        <span className="text-3xl font-black text-amber-600 tabular-nums tracking-tighter">{score}</span>
                    </div>
                </div>
            </div>

            {/* Timer Progress Bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border-2 border-white shadow-inner">
                <motion.div
                    initial={false}
                    animate={{ width: `${(timeLeft / 45) * 100}%` }}
                    className={cn(
                        "h-full transition-colors",
                        timeLeft > 15 ? "bg-emerald-500" : timeLeft > 5 ? "bg-amber-500" : "bg-red-500"
                    )}
                />
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-8 w-full max-w-2xl">
                {/* Left Column (Targets) */}
                <div className="flex flex-col gap-3">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {leftDisplay.map((item) => {
                            const isSelected = selectedLeft === item.id;
                            const isError = errorPair?.split('-')[0] === item.id;

                            return (
                                <motion.button
                                    key={`l-${item.id}`}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8, x: -30 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        x: 0,
                                        y: isSelected ? -4 : 0
                                    }}
                                    exit={{ opacity: 0, scale: 0.5, x: 50, filter: 'blur(8px)' }}
                                    whileHover={!isFinished ? { scale: 1.02 } : {}}
                                    whileTap={!isFinished ? { scale: 0.98 } : {}}
                                    onClick={() => handleLeftClick(item.id)}
                                    disabled={isFinished}
                                    className={cn(
                                        "p-4 md:p-6 rounded-[2rem] border-4 font-black transition-all flex items-center justify-center text-center shadow-lg min-h-[90px] group relative overflow-hidden",
                                        isSelected
                                            ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xl shadow-emerald-100"
                                            : isError
                                                ? "bg-red-50 border-red-500 text-red-700 shadow-red-100 animate-shake"
                                                : "bg-white border-slate-100 text-slate-600 hover:border-emerald-200"
                                    )}
                                >
                                    <span className="text-sm md:text-base leading-tight uppercase tracking-wide z-10">{item.text}</span>
                                    {isSelected && <motion.div layoutId="sparkle-l" className="absolute inset-0 bg-emerald-500/10" />}
                                </motion.button>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Right Column (Options) */}
                <div className="flex flex-col gap-3">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {rightDisplay.map((item) => {
                            const isSelected = selectedRight === item.id;
                            const isError = errorPair?.split('-')[1] === item.id;

                            return (
                                <motion.button
                                    key={`r-${item.id}`}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8, x: 30 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        x: 0,
                                        y: isSelected ? -4 : 0
                                    }}
                                    exit={{ opacity: 0, scale: 0.5, x: -50, filter: 'blur(8px)' }}
                                    whileHover={!isFinished ? { scale: 1.02 } : {}}
                                    whileTap={!isFinished ? { scale: 0.98 } : {}}
                                    onClick={() => handleRightClick(item.id)}
                                    disabled={isFinished}
                                    className={cn(
                                        "p-4 md:p-6 rounded-[2rem] border-4 font-black transition-all flex items-center justify-center text-center shadow-lg min-h-[90px] group relative overflow-hidden",
                                        isSelected
                                            ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xl shadow-emerald-100"
                                            : isError
                                                ? "bg-red-50 border-red-500 text-red-700 shadow-red-100 animate-shake"
                                                : "bg-white border-slate-100 text-slate-600 hover:border-emerald-200"
                                    )}
                                >
                                    <span className="text-sm md:text-base leading-tight uppercase tracking-wide z-10">{item.text}</span>
                                    {isSelected && <motion.div layoutId="sparkle-r" className="absolute inset-0 bg-emerald-500/10" />}
                                </motion.button>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {isFinished && (
                <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
                >
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-8 border-amber-400 text-center space-y-4 max-w-sm w-full">
                        <PartyPopper className="w-16 h-16 text-amber-500 mx-auto" />
                        <h3 className="text-3xl font-black text-slate-800">WAKTU HABIS!</h3>
                        <p className="text-slate-500 font-bold text-lg">Skor Akhir Anda:</p>
                        <div className="bg-amber-50 py-4 rounded-3xl border-4 border-amber-100">
                            <span className="text-7xl font-black text-amber-600 tracking-tighter">{score}</span>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="pt-8 text-center">
                <div className="flex items-center gap-3 justify-center mb-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                        Mode Kecepatan & Ketepatan
                    </p>
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                </div>
            </div>
        </div>
    );
}
