"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Send, X } from "lucide-react";
import Mascot from "@/components/gamification/Mascot";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { useSound } from "@/hooks/useSound";

interface ChapterFinishModalProps {
    isOpen: boolean;
    chapterTitle: string;
    onClose: () => void;
    onSubmit: () => void;
}

export default function ChapterFinishModal({ isOpen, chapterTitle, onClose, onSubmit }: ChapterFinishModalProps) {
    const { playSound } = useSound();

    useEffect(() => {
        if (isOpen) {
            playSound('victory');
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#4ade80', '#fbbf24', '#f87171', '#60a5fa']
            });
        }
    }, [isOpen, playSound]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
                    >
                        <div className="bg-green-500 p-8 flex flex-col items-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-4"
                            >
                                <CheckCircle2 className="h-12 w-12 text-green-500" />
                            </motion.div>
                            <h2 className="text-2xl font-black text-white text-center">CHAPTER SELESAI!</h2>
                            <p className="text-green-50 font-medium">{chapterTitle}</p>
                        </div>

                        <div className="p-8 flex flex-col items-center space-y-6">
                            <div className="relative py-4">
                                {/* Stage for the mascot */}
                                <div className="absolute inset-0 bg-slate-50 rounded-full blur-2xl opacity-50" />
                                <div className="relative z-10 bg-slate-50/50 rounded-full p-4 border border-slate-100 shadow-inner">
                                    <Mascot pose="cheer" className="scale-110" />
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <p className="text-slate-600 font-medium">
                                    Luar biasa! Kamu telah menyelesaikan semua misi di chapter ini.
                                </p>
                                <p className="text-slate-400 text-sm">
                                    Kirim bukti progresmu ke Mentor untuk membuka chapter selanjutnya.
                                </p>
                            </div>

                            <div className="w-full flex flex-col gap-3">
                                <Button
                                    onClick={onSubmit}
                                    className="w-full py-6 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-2xl shadow-[0_4px_0_rgb(21,128,61)] transition-all active:translate-y-1 active:shadow-none uppercase tracking-wide flex items-center justify-center gap-2"
                                >
                                    <Send className="h-5 w-5" />
                                    KIRIM KE MENTOR
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={onClose}
                                    className="w-full py-6 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl"
                                >
                                    NANTI SAJA
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
