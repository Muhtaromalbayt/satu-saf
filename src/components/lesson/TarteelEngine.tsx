
"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TarteelEngineProps {
    targetVerse: string; // The Arabic text to recite
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

    const recognitionRef = useRef<any>(null);
    const targetWords = targetTranscript.split(/\s+/).filter(Boolean);
    const verseWords = targetVerse.split(/\s+/).filter(Boolean);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = "ar-SA";

                recognitionRef.current.onresult = (event: any) => {
                    let interimTranscript = "";
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        const transcriptSegment = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            processTranscript(transcriptSegment);
                        } else {
                            interimTranscript += transcriptSegment;
                            processTranscript(interimTranscript);
                        }
                    }
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    setListening(false);
                };

                recognitionRef.current.onend = () => {
                    setListening(false);
                };
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [targetTranscript]);

    const processTranscript = (text: string) => {
        const spokenWords = text.toLowerCase().split(/\s+/).filter(Boolean);

        setRecognizedWords(prev => {
            const next = new Set(prev);
            targetWords.forEach((target, index) => {
                if (spokenWords.some(spoken => spoken.includes(target) || target.includes(spoken))) {
                    next.add(index);
                }
            });
            return next;
        });
    };

    useEffect(() => {
        if (onProgress) {
            onProgress(recognizedWords.size, targetWords.length);
        }

        if (recognizedWords.size >= targetWords.length && targetWords.length > 0 && !isFinished) {
            setIsFinished(true);
            if (listening) stopListening();
            if (onComplete) onComplete();
        }
    }, [recognizedWords, targetWords.length]);

    const startListening = () => {
        if (recognitionRef.current) {
            setRecognizedWords(new Set());
            setIsFinished(false);
            try {
                recognitionRef.current.start();
                setListening(true);
            } catch (e) {
                console.error("Start error:", e);
            }
        } else {
            alert("Browser Anda tidak mendukung Web Speech API.");
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setListening(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full space-y-12">
            {/* Display Area with Ghost Text Effect */}
            <div
                className="flex flex-wrap justify-center gap-4 p-8 rounded-[3rem] bg-slate-50/50 border-4 border-slate-100/50 min-h-[160px] w-full items-center font-arabic"
                dir="rtl"
            >
                {verseWords.map((word, idx) => {
                    const isMatched = recognizedWords.has(idx);
                    return (
                        <motion.span
                            key={idx}
                            initial={false}
                            animate={{
                                color: isMatched ? "#064e3b" : "#cbd5e1", // Dark Green vs Light Gray (Ghost Text)
                                scale: isMatched ? 1.15 : 1,
                                filter: isMatched ? "blur(0px)" : "blur(0.5px)"
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className={cn(
                                "text-4xl md:text-5xl font-bold transition-all duration-500",
                                isMatched ? "drop-shadow-sm" : "select-none"
                            )}
                        >
                            {word}
                        </motion.span>
                    )
                })}
            </div>

            {/* Pulsing Mic Button */}
            <div className="flex flex-col items-center gap-6">
                <AnimatePresence mode="wait">
                    {isFinished ? (
                        <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="bg-emerald-500 text-white p-6 rounded-full shadow-xl shadow-emerald-200"
                        >
                            <CheckCircle2 className="h-12 w-12" />
                        </motion.div>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={listening ? stopListening : startListening}
                            className={cn(
                                "h-24 w-24 rounded-full flex items-center justify-center shadow-2xl transition-all relative z-10",
                                listening
                                    ? "bg-red-500 text-white shadow-red-200"
                                    : "bg-primary text-white shadow-primary/30"
                            )}
                        >
                            {listening && (
                                <motion.div
                                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="absolute inset-0 bg-red-400 rounded-full -z-10"
                                />
                            )}
                            {listening ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
                        </motion.button>
                    )}
                </AnimatePresence>

                <p className="font-black text-slate-400 uppercase text-xs tracking-[0.2em]">
                    {listening ? "MENDENGARKAN..." : isFinished ? "SELESAI!" : "TEKAN & MULAI BACA"}
                </p>
            </div>
        </div>
    );
}
