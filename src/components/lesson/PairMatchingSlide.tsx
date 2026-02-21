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

    useEffect(() => {
        // Initialize and shuffle
        setLeftItems(data.pairs);
        const shuffledRight = [...data.pairs].sort(() => Math.random() - 0.5);
        setRightItems(shuffledRight);
    }, [data]);

    const handleLeftClick = (id: string) => {
        if (matchedIds.includes(id)) return;
        setSelectedLeft(id);
        setErrorPair(null);

        if (selectedRight) {
            checkMatch(id, selectedRight);
        }
    };

    const handleRightClick = (id: string) => {
        if (matchedIds.includes(id)) return;
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
                setTimeout(() => onComplete(true), 1000);
            }
        } else {
            // Mismatch
            setErrorPair(`${leftId}-${rightId}`);
            setTimeout(() => {
                setSelectedLeft(null);
                setSelectedRight(null);
                setErrorPair(null);
            }, 800);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 flex flex-col items-center">
            <h2 className="text-3xl font-black text-center mb-10 text-slate-800 tracking-tight leading-tight">
                {data.title}
            </h2>

            <div className="flex justify-between gap-6 w-full">
                {/* Left Column */}
                <div className="flex flex-col gap-4 w-1/2">
                    {leftItems.map((item) => (
                        <motion.button
                            key={`left-${item.id}`}
                            whileHover={!matchedIds.includes(item.id) ? { scale: 1.02, x: 5 } : {}}
                            whileTap={!matchedIds.includes(item.id) ? { scale: 0.98 } : {}}
                            onClick={() => handleLeftClick(item.id)}
                            disabled={matchedIds.includes(item.id)}
                            className={cn(
                                "p-4 md:p-6 rounded-[1.5rem] border-4 font-black transition-all flex items-center justify-center text-center shadow-lg h-24",
                                matchedIds.includes(item.id)
                                    ? "bg-slate-50 border-slate-100 text-slate-200 shadow-none opacity-40"
                                    : selectedLeft === item.id
                                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-emerald-100"
                                        : "bg-white border-slate-100 text-slate-600 hover:border-emerald-200"
                            )}
                        >
                            <span className="text-sm md:text-base leading-tight uppercase tracking-wide">{item.left}</span>
                        </motion.button>
                    ))}
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-4 w-1/2">
                    {rightItems.map((item) => (
                        <motion.button
                            key={`right-${item.id}`}
                            whileHover={!matchedIds.includes(item.id) ? { scale: 1.02, x: -5 } : {}}
                            whileTap={!matchedIds.includes(item.id) ? { scale: 0.98 } : {}}
                            onClick={() => handleRightClick(item.id)}
                            disabled={matchedIds.includes(item.id)}
                            animate={errorPair?.includes(item.id) ? { x: [-10, 10, -10, 10, 0] } : {}}
                            className={cn(
                                "p-4 md:p-6 rounded-[1.5rem] border-4 font-black transition-all flex items-center justify-center text-center shadow-lg h-24",
                                matchedIds.includes(item.id)
                                    ? "bg-emerald-500 border-emerald-400 text-white shadow-emerald-200 scale-95 opacity-50"
                                    : selectedRight === item.id
                                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-emerald-100"
                                        : "bg-white border-slate-100 text-slate-600 hover:border-emerald-200"
                            )}
                        >
                            <span className="text-sm md:text-base leading-tight uppercase tracking-wide">{item.right}</span>
                        </motion.button>
                    ))}
                </div>
            </div>

            <div className="mt-12 w-full flex justify-center">
                <div className="bg-slate-50 text-slate-400 font-bold px-6 py-2 rounded-full text-xs uppercase tracking-[0.2em] border-2 border-slate-100">
                    Jodohkan Semua Pasangan ({matchedIds.length}/{data.pairs.length})
                </div>
            </div>
        </div>
    );
}
