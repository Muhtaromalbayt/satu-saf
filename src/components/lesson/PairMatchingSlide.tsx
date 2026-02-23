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
    const [leftItems, setLeftItems] = useState<Pair[]>([]);
    const [rightItems, setRightItems] = useState<Pair[]>([]);
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [selectedRight, setSelectedRight] = useState<string | null>(null);
    const [matchedIds, setMatchedIds] = useState<string[]>([]);
    const [errorPair, setErrorPair] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(45);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        // Initialize and shuffle
        setLeftItems(data.pairs);
        const shuffledRight = [...data.pairs].sort(() => Math.random() - 0.5);
        setRightItems(shuffledRight);
    }, [data.pairs]);

    useEffect(() => {
        if (isFinished) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleEnd(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isFinished]);

    const handleEnd = (success: boolean) => {
        setIsFinished(true);
        setTimeout(() => {
            onComplete(success);
        }, 1000);
    };

    const handleLeftClick = (id: string) => {
        if (matchedIds.includes(id) || isFinished) return;
        setSelectedLeft(id);
        setErrorPair(null);

        if (selectedRight) {
            checkMatch(id, selectedRight);
        }
    };

    const handleRightClick = (id: string) => {
        if (matchedIds.includes(id) || isFinished) return;
        setSelectedRight(id);
        setErrorPair(null);

        if (selectedLeft) {
            checkMatch(selectedLeft, id);
        }
    };

    const checkMatch = (leftId: string, rightId: string) => {
        if (leftId === rightId) {
            // Match found!
            const newMatched = [...matchedIds, leftId];
            setMatchedIds(newMatched);
            setSelectedLeft(null);
            setSelectedRight(null);

            if (newMatched.length === data.pairs.length) {
                handleEnd(true);
            }
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
        <div className="w-full max-w-3xl mx-auto p-4 flex flex-col items-center space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">
                    {data.title}
                </h2>
                <div className="flex items-center justify-center gap-4">
                    <div className="bg-slate-100/50 px-4 py-1.5 rounded-full border-2 border-slate-100 backdrop-blur-sm">
                        <span className="font-black text-slate-500 text-xs uppercase tracking-[0.2em]">
                            PASANGAN: {matchedIds.length} / {data.pairs.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Global Timer Bar */}
            <div className="w-full max-w-md h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-white shadow-inner relative">
                <motion.div
                    initial={false}
                    animate={{ width: `${(timeLeft / 45) * 100}%` }}
                    className={cn(
                        "h-full transition-colors",
                        timeLeft > 15 ? "bg-emerald-500" : timeLeft > 5 ? "bg-amber-500" : "bg-red-500"
                    )}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-black text-slate-600 drop-shadow-sm">
                        {timeLeft} DETIK TERSISA
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-8 w-full">
                {/* Left Column */}
                <div className="flex flex-col gap-3">
                    {leftItems.map((item) => {
                        const isMatched = matchedIds.includes(item.id);
                        const isSelected = selectedLeft === item.id;
                        const isError = errorPair?.split('-')[0] === item.id;

                        return (
                            <motion.button
                                key={`left-${item.id}`}
                                whileHover={!isMatched && !isFinished ? { scale: 1.02, x: 5 } : {}}
                                whileTap={!isMatched && !isFinished ? { scale: 0.98 } : {}}
                                onClick={() => handleLeftClick(item.id)}
                                disabled={isMatched || isFinished}
                                animate={isError ? { x: [-5, 5, -5, 5, 0] } : {}}
                                className={cn(
                                    "p-4 md:p-6 rounded-[1.5rem] border-4 font-black transition-all flex items-center justify-center text-center shadow-lg min-h-[80px]",
                                    isMatched
                                        ? "bg-emerald-50 border-emerald-100 text-emerald-200 shadow-none opacity-40 scale-95"
                                        : isSelected
                                            ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xl shadow-emerald-100"
                                            : isError
                                                ? "bg-red-50 border-red-500 text-red-700 shadow-red-100"
                                                : "bg-white border-slate-100 text-slate-600 hover:border-emerald-200"
                                )}
                            >
                                <span className="text-sm md:text-base leading-tight uppercase tracking-wide">{item.left}</span>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-3">
                    {rightItems.map((item) => {
                        const isMatched = matchedIds.includes(item.id);
                        const isSelected = selectedRight === item.id;
                        const isError = errorPair?.split('-')[1] === item.id;

                        return (
                            <motion.button
                                key={`right-${item.id}`}
                                whileHover={!isMatched && !isFinished ? { scale: 1.02, x: -5 } : {}}
                                whileTap={!isMatched && !isFinished ? { scale: 0.98 } : {}}
                                onClick={() => handleRightClick(item.id)}
                                disabled={isMatched || isFinished}
                                animate={isError ? { x: [-5, 5, -5, 5, 0] } : {}}
                                className={cn(
                                    "p-4 md:p-6 rounded-[1.5rem] border-4 font-black transition-all flex items-center justify-center text-center shadow-lg min-h-[80px]",
                                    isMatched
                                        ? "bg-emerald-500 border-emerald-400 text-white shadow-none opacity-30 scale-95"
                                        : isSelected
                                            ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xl shadow-emerald-100"
                                            : isError
                                                ? "bg-red-50 border-red-500 text-red-700 shadow-red-100"
                                                : "bg-white border-slate-100 text-slate-600 hover:border-emerald-200"
                                )}
                            >
                                <span className="text-sm md:text-base leading-tight uppercase tracking-wide">{item.right}</span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            <div className="pt-4 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
                    Jodohkan Secepat Mungkin!
                </p>
            </div>
        </div>
    );
}
