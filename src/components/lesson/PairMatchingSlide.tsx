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
        <div className="w-full max-w-lg p-4">
            <h2 className="text-2xl font-bold text-center mb-8 text-slate-700">{data.title}</h2>

            <div className="flex justify-between gap-8">
                {/* Left Column */}
                <div className="flex flex-col gap-4 w-1/2">
                    {leftItems.map((item) => (
                        <motion.button
                            key={`left-${item.id}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleLeftClick(item.id)}
                            disabled={matchedIds.includes(item.id)}
                            className={cn(
                                "p-4 rounded-xl border-2 border-b-4 font-bold text-sm md:text-base transition-colors min-h-[80px] flex items-center justify-center text-center",
                                matchedIds.includes(item.id)
                                    ? "bg-slate-100 border-slate-200 text-slate-300 scale-95 opacity-50"
                                    : selectedLeft === item.id
                                        ? "bg-blue-100 border-blue-400 text-blue-700"
                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            {item.left}
                        </motion.button>
                    ))}
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-4 w-1/2">
                    {rightItems.map((item) => (
                        <motion.button
                            key={`right-${item.id}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleRightClick(item.id)}
                            disabled={matchedIds.includes(item.id)}
                            animate={errorPair?.includes(item.id) ? { x: [-10, 10, -10, 10, 0] } : {}}
                            className={cn(
                                "p-4 rounded-xl border-2 border-b-4 font-bold text-sm md:text-base transition-colors min-h-[80px] flex items-center justify-center text-center",
                                matchedIds.includes(item.id)
                                    ? "bg-green-100 border-green-200 text-green-300 scale-95 opacity-50"
                                    : selectedRight === item.id
                                        ? "bg-blue-100 border-blue-400 text-blue-700"
                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            {item.right}
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
}
