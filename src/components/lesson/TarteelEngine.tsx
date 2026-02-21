
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TarteelEngineProps {
    targetVerse: string; // The Arabic text to recite (with diacritics)
    targetTranscript: string; // The clean Arabic text for matching (no diacritics)
    onComplete?: () => void;
    onProgress?: (matchedCount: number, totalCount: number) => void;
}

export default function TarteelEngine({
    targetVerse,
    targetTranscript,
    onComplete,
    onProgress
}: TarteelEngineProps) {
    const [listening, setListening] = useState(false);
    const [recognizedWords, setRecognizedWords] = useState<Set<number>>(new Set());
    const [isFinished, setIsFinished] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<any>(null);
    const targetWords = targetTranscript.split(/\s+/).filter(Boolean);
    const verseWords = targetVerse.split(/\s+/).filter(Boolean);

    // Optimized matching function
    const processTranscript = useCallback((text: string) => {
        const spokenWords = text.toLowerCase().split(/\s+/).filter(Boolean);

        setRecognizedWords(prev => {
            const next = new Set(prev);
            targetWords.forEach((target, index) => {
                if (next.has(index)) return;

                // Simple fuzzy matching: check if target word exists in the spoken words
                const isMatch = spokenWords.some(spoken => {
                    // Normalize (simplistic version, can be expanded)
                    const normalizedSpoken = spoken.replace(/[^\u0621-\u064A]/g, '');
                    const normalizedTarget = target.replace(/[^\u0621-\u064A]/g, '');

                    return normalizedSpoken.includes(normalizedTarget) ||
                        normalizedTarget.includes(normalizedSpoken) ||
                        spoken.length > 2 && target.includes(spoken);
                });

                if (isMatch) {
                    next.add(index);
                }
            });
            return next;
        });
    }, [targetWords]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setError("Browser anda tidak mendukung pengenalan suara.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "ar-SA";

        recognition.onresult = (event: any) => {
            let combinedTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                combinedTranscript += event.results[i][0].transcript;
            }
            processTranscript(combinedTranscript);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            if (event.error === 'not-allowed') {
                setError("Izin mikrofon ditolak.");
            }
            setListening(false);
        };

        recognition.onend = () => {
            setListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [processTranscript]);

    useEffect(() => {
        if (onProgress) {
            onProgress(recognizedWords.size, targetWords.length);
        }

        if (recognizedWords.size >= targetWords.length && targetWords.length > 0 && !isFinished) {
            setIsFinished(true);
            stopListening();
            if (onComplete) onComplete();
        }
    }, [recognizedWords.size, targetWords.length, onProgress, isFinished, onComplete]);

    const startListening = () => {
        if (!recognitionRef.current) return;

        setError(null);
        setRecognizedWords(new Set());
        setIsFinished(false);

        try {
            recognitionRef.current.start();
            setListening(true);
        } catch (e) {
            console.error("Start error:", e);
            // If already started, just ensure state is correct
            setListening(true);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (e) { }
            setListening(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full space-y-10">
            {/* Display Area with Ghost Text Effect */}
            <div
                className="flex flex-wrap justify-center gap-x-4 gap-y-6 p-10 rounded-[3rem] bg-white border-4 border-slate-50 min-h-[180px] w-full items-center font-arabic shadow-xl relative"
                dir="rtl"
            >
                {verseWords.map((word, idx) => {
                    const isMatched = recognizedWords.has(idx);
                    return (
                        <motion.span
                            key={idx}
                            initial={false}
                            animate={{
                                color: isMatched ? "#064E3B" : "#D1D5DB", // Dark Emerald vs Light Gray
                                scale: isMatched ? 1.15 : 1,
                                filter: isMatched ? "blur(0px)" : "blur(0.3px)",
                                textShadow: isMatched ? "0px 0px 8px rgba(16, 185, 129, 0.2)" : "none"
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 15,
                                color: { duration: 0.2 }
                            }}
                            className={cn(
                                "text-4xl md:text-5xl lg:text-6xl font-black relative z-10",
                                isMatched ? "drop-shadow-sm" : "select-none opacity-60"
                            )}
                        >
                            {word}
                        </motion.span>
                    );
                })}
            </div>

            {/* Controls & Feedback */}
            <div className="flex flex-col items-center gap-4">
                <AnimatePresence mode="wait">
                    {error ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-red-500 font-bold bg-red-50 p-3 px-6 rounded-full border border-red-100"
                        >
                            <AlertCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </motion.div>
                    ) : isFinished ? (
                        <motion.div
                            initial={{ scale: 0, rotate: -15 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="bg-emerald-500 text-white p-6 rounded-full shadow-lg shadow-emerald-200"
                        >
                            <CheckCircle2 className="h-10 w-10" />
                        </motion.div>
                    ) : (
                        <div className="relative">
                            {/* Pulse background */}
                            <AnimatePresence>
                                {listening && (
                                    <>
                                        <motion.div
                                            initial={{ scale: 1, opacity: 0.5 }}
                                            animate={{ scale: 2, opacity: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                                            className="absolute inset-0 bg-emerald-400 rounded-full -z-10"
                                        />
                                        <motion.div
                                            initial={{ scale: 1, opacity: 0.3 }}
                                            animate={{ scale: 1.6, opacity: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                            className="absolute inset-0 bg-emerald-300 rounded-full -z-10"
                                        />
                                    </>
                                )}
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={listening ? stopListening : startListening}
                                className={cn(
                                    "h-20 w-20 rounded-full flex items-center justify-center shadow-xl transition-all relative z-10",
                                    listening
                                        ? "bg-red-500 text-white"
                                        : "bg-emerald-500 text-white hover:bg-emerald-600"
                                )}
                            >
                                {listening ? (
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ repeat: Infinity, duration: 0.5 }}
                                    >
                                        <MicOff className="h-8 w-8" />
                                    </motion.div>
                                ) : (
                                    <Mic className="h-8 w-8" />
                                )}
                            </motion.button>
                        </div>
                    )}
                </AnimatePresence>

                <div className="text-center h-6">
                    <p className={cn(
                        "font-black uppercase text-[10px] tracking-[0.25em] transition-colors",
                        listening ? "text-red-500" : "text-slate-400"
                    )}>
                        {listening ? "SAYA MENDENGARKAN..." : isFinished ? "MAASYA ALLAH!" : "MULAI REKAMAN"}
                    </p>
                </div>
            </div>
        </div>
    );
}
