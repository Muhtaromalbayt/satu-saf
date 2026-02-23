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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(45);
    const [rightItems, setRightItems] = useState<Pair[]>([]);
    const [selectedRight, setSelectedRight] = useState<string | null>(null);
    const [isMismatch, setIsMismatch] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const currentPair = data.pairs[currentIndex];

    useEffect(() => {
        // Shuffle right items once at the start
        const shuffled = [...data.pairs].sort(() => Math.random() - 0.5);
        setRightItems(shuffled);
    }, [data.pairs]);

    useEffect(() => {
        if (isComplete || isMismatch) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleFail();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentIndex, isComplete, isMismatch]);

    const handleFail = () => {
        setIsMismatch(true);
        setTimeout(() => {
            onComplete(false); // Move next with failure
        }, 1500);
    };

    const handleRightClick = (id: string) => {
        if (isComplete || isMismatch || selectedRight) return;

        setSelectedRight(id);

        if (id === currentPair.id) {
            // Correct match
            setTimeout(() => {
                if (currentIndex < data.pairs.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                    setTimeLeft(45);
                    setSelectedRight(null);
                } else {
                    setIsComplete(true);
                    onComplete(true);
                }
            }, 600);
        } else {
            // Wrong match
            setIsMismatch(true);
            setTimeout(() => {
                onComplete(false);
            }, 1000);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 flex flex-col items-center space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">
                    {data.title}
                </h2>
                <div className="flex items-center justify-center gap-4">
                    <div className="bg-slate-100 px-4 py-1.5 rounded-full border-2 border-slate-200">
                        <span className="font-black text-slate-500 text-sm uppercase tracking-widest">
                            Item {currentIndex + 1} / {data.pairs.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Timer Progress Bar */}
            <div className="w-full max-w-sm h-3 bg-slate-100 rounded-full overflow-hidden border-2 border-white shadow-inner relative">
                <motion.div
                    initial={false}
                    animate={{ width: `${(timeLeft / 45) * 100}%` }}
                    className={cn(
                        "h-full transition-colors",
                        timeLeft > 15 ? "bg-emerald-500" : timeLeft > 5 ? "bg-amber-500" : "bg-red-500"
                    )}
                />
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-8 w-full items-start">
                {/* Left Side: The Target Item */}
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Cari Pasangan:</p>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPair.id}
                            initial={{ opacity: 0, scale: 0.8, x: -20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: 20 }}
                            className="p-8 rounded-[2rem] border-4 border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xl shadow-emerald-100 flex items-center justify-center text-center min-h-[160px]"
                        >
                            <span className="text-2xl font-black uppercase tracking-tight leading-tight">
                                {currentPair.left}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right Side: Options */}
                <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {rightItems.map((item) => {
                        const isSelected = selectedRight === item.id;
                        const isCorrect = isSelected && item.id === currentPair.id;
                        const isWrong = isSelected && item.id !== currentPair.id;

                        return (
                            <motion.button
                                key={item.id}
                                whileHover={!selectedRight ? { scale: 1.02 } : {}}
                                whileTap={!selectedRight ? { scale: 0.98 } : {}}
                                onClick={() => handleRightClick(item.id)}
                                disabled={!!selectedRight || isMismatch || isComplete}
                                className={cn(
                                    "p-6 rounded-[1.8rem] border-4 font-black transition-all flex items-center justify-center text-center shadow-lg min-h-[100px]",
                                    isCorrect ? "bg-emerald-500 border-emerald-400 text-white" :
                                        isWrong || (isMismatch && item.id === selectedRight) ? "bg-red-500 border-red-400 text-white" :
                                            "bg-white border-slate-100 text-slate-600 hover:border-emerald-200"
                                )}
                            >
                                <span className="text-base leading-tight uppercase tracking-wide">{item.right}</span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            <div className="pt-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Fokus pada Kecepatan & Ketepatan!
                </p>
            </div>
        </div>
    );
}
