"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    const [boardPairs, setBoardPairs] = useState<Pair[]>([]); // 5 pairs on board
    const [pool, setPool] = useState<Pair[]>([]);
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
        const shuffled = [...data.pairs].sort(() => Math.random() - 0.5);
        const initialBoard = shuffled.slice(0, 5);
        const initialPool = shuffled.slice(5);

        setBoardPairs(initialBoard);
        setPool(initialPool);

        setLeftDisplay(initialBoard.map(p => ({ id: p.id, text: p.left })).sort(() => Math.random() - 0.5));
        setRightDisplay(initialBoard.map(p => ({ id: p.id, text: p.right })).sort(() => Math.random() - 0.5));
    }, [data.pairs]);

    // Timer
    useEffect(() => {
        if (isFinished) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsFinished(true);
                    setTimeout(() => onComplete(true), 1500); // Always succeed in endless mode
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

            // Replacement logic
            let nextPair: Pair;
            let newPool = [...pool];

            if (newPool.length === 0) {
                // Refill pool if empty
                newPool = [...data.pairs].sort(() => Math.random() - 0.5);
            }

            nextPair = newPool.shift()!;
            setPool(newPool);

            // Update displays at the same positions
            setLeftDisplay(prev => prev.map(item => item.id === leftId ? { id: nextPair.id, text: nextPair.left } : item));
            setRightDisplay(prev => prev.map(item => item.id === rightId ? { id: nextPair.id, text: nextPair.right } : item));

            setSelectedLeft(null);
            setSelectedRight(null);
        } else {
            // Mismatch
            setErrorPair(`${leftId}-${rightId}`);
            setTimeout(() => {
                setSelectedLeft(null);
                setSelectedRight(null);
                setErrorPair(null);
            }, 500);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center space-y-6">
            <div className="w-full flex justify-between items-center bg-white/50 backdrop-blur-md p-4 rounded-3xl border-2 border-slate-100 shadow-sm">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu</span>
                    <span className={cn(
                        "text-2xl font-black tabular-nums",
                        timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-emerald-600"
                    )}>{timeLeft}s</span>
                </div>

                <h2 className="text-xl font-black text-slate-800 hidden md:block">
                    {data.title}
                </h2>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Skor</span>
                    <span className="text-2xl font-black text-amber-500 tabular-nums">{score}</span>
                </div>
            </div>

            {/* Timer Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-white shadow-inner">
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
                    <AnimatePresence mode="popLayout">
                        {leftDisplay.map((item) => {
                            const isSelected = selectedLeft === item.id;
                            const isError = errorPair?.split('-')[0] === item.id;

                            return (
                                <motion.button
                                    key={`l-${item.id}`}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                                    whileHover={!isFinished ? { scale: 1.02, x: 5 } : {}}
                                    whileTap={!isFinished ? { scale: 0.98 } : {}}
                                    onClick={() => handleLeftClick(item.id)}
                                    disabled={isFinished}
                                    className={cn(
                                        "p-4 md:p-6 rounded-[1.5rem] border-4 font-black transition-all flex items-center justify-center text-center shadow-md min-h-[85px]",
                                        isSelected
                                            ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xl shadow-emerald-100"
                                            : isError
                                                ? "bg-red-50 border-red-500 text-red-700 shadow-red-100"
                                                : "bg-white border-slate-100 text-slate-600 hover:border-emerald-200"
                                    )}
                                >
                                    <span className="text-sm md:text-base leading-tight uppercase tracking-wide">{item.text}</span>
                                </motion.button>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Right Column (Options) */}
                <div className="flex flex-col gap-3">
                    <AnimatePresence mode="popLayout">
                        {rightDisplay.map((item) => {
                            const isSelected = selectedRight === item.id;
                            const isError = errorPair?.split('-')[1] === item.id;

                            return (
                                <motion.button
                                    key={`r-${item.id}`}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                                    whileHover={!isFinished ? { scale: 1.02, x: -5 } : {}}
                                    whileTap={!isFinished ? { scale: 0.98 } : {}}
                                    onClick={() => handleRightClick(item.id)}
                                    disabled={isFinished}
                                    className={cn(
                                        "p-4 md:p-6 rounded-[1.5rem] border-4 font-black transition-all flex items-center justify-center text-center shadow-md min-h-[85px]",
                                        isSelected
                                            ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xl shadow-emerald-100"
                                            : isError
                                                ? "bg-red-50 border-red-500 text-red-700 shadow-red-100"
                                                : "bg-white border-slate-100 text-slate-600 hover:border-emerald-200"
                                    )}
                                >
                                    <span className="text-sm md:text-base leading-tight uppercase tracking-wide">{item.text}</span>
                                </motion.button>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {isFinished && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-500 text-white px-8 py-4 rounded-3xl shadow-xl border-4 border-amber-400 font-black text-2xl"
                >
                    WAKTU HABIS! Skor: {score}
                </motion.div>
            )}

            <div className="pt-4 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Fokus Banyak-banyakan Pasangan!
                </p>
            </div>
        </div>
    );
}
