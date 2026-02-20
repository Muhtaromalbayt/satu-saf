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
        <div className="w-full max-w-lg p-4 flex flex-col items-center space-y-8">
            <h2 className="text-xl font-medium text-center text-slate-600 mb-4">{data.question}</h2>

            {/* Sentence Display Area */}
            <div className="min-h-[120px] w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 flex flex-wrap gap-2 content-start transition-colors duration-300"
                style={{
                    borderColor: checkStatus === 'correct' ? '#22c55e' : checkStatus === 'incorrect' ? '#ef4444' : '#e2e8f0'
                }}
            >
                <AnimatePresence>
                    {selectedWords.map((word) => (
                        <motion.button
                            key={word.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            layoutId={word.id}
                            onClick={() => handleDeselectWord(word)}
                            className="px-4 py-2 bg-white rounded-xl border-2 border-b-4 border-slate-200 text-slate-700 font-bold shadow-sm hover:bg-slate-50 text-base"
                        >
                            {word.text}
                        </motion.button>
                    ))}
                </AnimatePresence>

                {selectedWords.length === 0 && (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm font-medium italic">
                        Tap words to build the sentence
                    </div>
                )}
            </div>

            {/* Available Words */}
            <div className="w-full flex flex-wrap gap-3 justify-center min-h-[100px]">
                <AnimatePresence>
                    {availableWords.map((word) => (
                        <motion.button
                            key={word.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            layoutId={word.id}
                            onClick={() => handleSelectWord(word)}
                            className="px-4 py-2 bg-white rounded-xl border-2 border-b-4 border-slate-200 text-slate-700 font-bold shadow-sm hover:bg-slate-50 text-base"
                        >
                            {word.text}
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            {/* Check Button */}
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCheck}
                disabled={selectedWords.length === 0 || checkStatus === 'correct'}
                className={cn(
                    "w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all",
                    checkStatus === 'correct'
                        ? "bg-green-500 text-white"
                        : checkStatus === 'incorrect'
                            ? "bg-red-500 text-white"
                            : selectedWords.length > 0
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                )}
            >
                {checkStatus === 'correct' ? (
                    <>
                        <Check className="w-6 h-6" />
                        Benar!
                    </>
                ) : checkStatus === 'incorrect' ? (
                    <>
                        Salah, Coba Lagi
                    </>
                ) : (
                    "Periksa Jawaban"
                )}
            </motion.button>
        </div>
    );
}
