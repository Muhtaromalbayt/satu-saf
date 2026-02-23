"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizSlideProps {
    data: {
        question: string;
        options: {
            text: string;
            image?: string;
        }[] | string[];
        correctIndex: number;
        isTrueFalse?: boolean;
    };
    onAnswer: (isCorrect: boolean) => void;
}

export default function QuizSlide({ data, onAnswer }: QuizSlideProps) {
    const [selected, setSelected] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const options = data.options.map(opt =>
        typeof opt === 'string' ? { text: opt } : opt
    );

    const handleSelect = (index: number) => {
        if (isSubmitted) return;

        setSelected(index);
        setIsSubmitted(true);

        // Brief delay to show feedback (green/red) before moving to next slide
        setTimeout(() => {
            onAnswer(index === data.correctIndex);
        }, 1200);
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8 flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight">
                    {data.question}
                </h2>
                {data.isTrueFalse && (
                    <span className="inline-block px-4 py-1 bg-amber-100 text-amber-700 rounded-full font-black text-xs uppercase tracking-widest">
                        Benar atau Salah?
                    </span>
                )}
            </motion.div>

            <div className={cn(
                "grid gap-4 w-full px-2",
                options.some(o => o.image) ? "grid-cols-2" : "grid-cols-1"
            )}>
                {options.map((option, index) => {
                    const isSelected = selected === index;
                    const isCorrect = index === data.correctIndex;
                    const showSuccess = isSubmitted && isCorrect;
                    const showError = isSubmitted && isSelected && !isCorrect;

                    return (
                        <motion.button
                            key={index}
                            whileHover={!isSubmitted ? { scale: 1.02, y: -2 } : {}}
                            whileTap={!isSubmitted ? { scale: 0.98 } : {}}
                            onClick={() => handleSelect(index)}
                            disabled={isSubmitted}
                            className={cn(
                                "relative p-4 md:p-6 rounded-[2rem] border-4 transition-all duration-300 text-left flex flex-col items-center gap-4 group",
                                isSelected ? (
                                    isSubmitted
                                        ? (isCorrect ? "bg-emerald-500 border-emerald-400 text-white shadow-emerald-200" : "bg-red-500 border-red-400 text-white shadow-red-200")
                                        : "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xl shadow-emerald-100"
                                ) : "bg-white border-slate-100 text-slate-600 hover:border-emerald-200",
                                isSubmitted && !isSelected && isCorrect && "border-emerald-500 bg-emerald-50",
                                isSubmitted && !isSelected && !isCorrect && "opacity-50"
                            )}
                        >
                            {option.image && (
                                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 border-2 border-slate-100 group-hover:border-emerald-100 transition-colors relative">
                                    <img src={option.image} alt={option.text} className="w-full h-full object-cover" />
                                    {isSubmitted && isCorrect && (
                                        <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                                            <Check className="w-12 h-12 text-white drop-shadow-lg" />
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-3 w-full">
                                <div className={cn(
                                    "h-8 w-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                                    isSelected ? "bg-white border-transparent" : "border-slate-200"
                                )}>
                                    {index === 0 ? 'A' : index === 1 ? 'B' : index === 2 ? 'C' : 'D'}
                                </div>
                                <span className="font-black text-lg md:text-xl">{option.text}</span>
                            </div>

                            <AnimatePresence>
                                {showSuccess && (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className="absolute -top-3 -right-3 bg-emerald-400 text-white rounded-full p-2 shadow-lg z-10"
                                    >
                                        <Check className="h-5 w-5 stroke-[4]" />
                                    </motion.div>
                                )}
                                {showError && (
                                    <motion.div
                                        initial={{ scale: 0, rotate: 45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className="absolute -top-3 -right-3 bg-red-400 text-white rounded-full p-2 shadow-lg z-10"
                                    >
                                        <X className="h-5 w-5 stroke-[4]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
