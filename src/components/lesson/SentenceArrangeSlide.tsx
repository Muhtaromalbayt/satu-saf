"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, RotateCcw } from "lucide-react";

interface SentenceArrangeSlideProps {
    data: {
        question: string;
        correctSentence: string;
        words: string[]; // Shuffled words
    };
    onComplete: (isCorrect: boolean) => void;
}

export default function SentenceArrangeSlide({ data, onComplete }: SentenceArrangeSlideProps) {
    const [availableWords, setAvailableWords] = useState<{ id: string, text: string }[]>([]);
    const [selectedWords, setSelectedWords] = useState<{ id: string, text: string }[]>([]);
    const [checkStatus, setCheckStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

    useEffect(() => {
        // Initialize words with unique IDs to handle duplicate words
        setAvailableWords(data.words.map((w, i) => ({ id: `${i}-${w}`, text: w })));
        setSelectedWords([]);
        setCheckStatus('idle');
    }, [data]);

    const handleSelectWord = (word: { id: string, text: string }) => {
        if (checkStatus === 'correct') return;
        setAvailableWords(prev => prev.filter(w => w.id !== word.id));
        setSelectedWords(prev => [...prev, word]);
        setCheckStatus('idle');
    };

    const handleDeselectWord = (word: { id: string, text: string }) => {
        if (checkStatus === 'correct') return;
        setSelectedWords(prev => prev.filter(w => w.id !== word.id));
        setAvailableWords(prev => [...prev, word]);
        setCheckStatus('idle');
    };

    const handleCheck = () => {
        const formedSentence = selectedWords.map(w => w.text).join(" ");
        if (formedSentence === data.correctSentence) {
            setCheckStatus('correct');
            // Play success sound if available
            setTimeout(() => onComplete(true), 1500);
        } else {
            setCheckStatus('incorrect');
            // Play error sound/animation
            setTimeout(() => setCheckStatus('idle'), 1500);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 flex flex-col items-center space-y-10">
            <h2 className="text-3xl font-black text-center text-slate-800 mb-2 tracking-tight leading-tight">
                {data.question}
            </h2>

            {/* Sentence Display Area */}
            <div className={cn(
                "min-h-[140px] w-full p-6 rounded-[2.5rem] bg-slate-50 border-4 transition-all duration-300 flex flex-wrap gap-3 content-start shadow-inner",
                checkStatus === 'correct' ? 'border-emerald-500 bg-emerald-50/50' :
                    checkStatus === 'incorrect' ? 'border-red-500 bg-red-50/50' : 'border-slate-100'
            )}>
                <AnimatePresence>
                    {selectedWords.map((word) => (
                        <motion.button
                            key={word.id}
                            initial={{ scale: 0.8, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 10 }}
                            layoutId={word.id}
                            onClick={() => handleDeselectWord(word)}
                            className="px-5 py-3 bg-white rounded-2xl border-b-4 border-2 border-slate-200 text-slate-700 font-black shadow-sm hover:translate-y-0.5 active:translate-y-1 transition-all text-lg uppercase tracking-wide"
                        >
                            {word.text}
                        </motion.button>
                    ))}
                </AnimatePresence>

                {selectedWords.length === 0 && (
                    <div className="w-full flex items-center justify-center text-slate-300 text-sm font-black uppercase tracking-[0.2em] italic mt-8">
                        TAP KATA UNTUK MENYUSUN
                    </div>
                )}
            </div>

            {/* Available Words */}
            <div className="w-full flex flex-wrap gap-4 justify-center min-h-[120px]">
                <AnimatePresence>
                    {availableWords.map((word) => (
                        <motion.button
                            key={word.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            layoutId={word.id}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSelectWord(word)}
                            className="px-5 py-3 bg-white rounded-2xl border-b-4 border-2 border-slate-200 text-slate-600 font-black shadow-md hover:border-emerald-200 text-lg uppercase tracking-wide"
                        >
                            {word.text}
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            {/* Check Button */}
            <div className="w-full flex justify-center pt-4">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCheck}
                    disabled={selectedWords.length === 0 || checkStatus === 'correct'}
                    className={cn(
                        "w-full max-w-sm py-5 rounded-[2.5rem] font-black text-2xl uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3",
                        checkStatus === 'correct'
                            ? "bg-emerald-500 text-white shadow-emerald-200"
                            : checkStatus === 'incorrect'
                                ? "bg-red-500 text-white shadow-red-200"
                                : selectedWords.length > 0
                                    ? "bg-emerald-500 text-white shadow-emerald-200 hover:scale-105 active:scale-95"
                                    : "bg-slate-100 text-slate-400 shadow-none cursor-not-allowed"
                    )}
                >
                    {checkStatus === 'correct' ? (
                        <>
                            <Check className="w-8 h-8 stroke-[4]" />
                            BENAR!
                        </>
                    ) : checkStatus === 'incorrect' ? (
                        <>
                            <RotateCcw className="w-8 h-8 stroke-[4] animate-spin-slow" />
                            COBA LAGI
                        </>
                    ) : (
                        "PERIKSA JAWABAN"
                    )}
                </motion.button>
            </div>
        </div>
    );
}
