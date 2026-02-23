
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, CheckCircle2, ChevronRight, Trophy, Star, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import confetti from 'canvas-confetti';
import { cn } from "@/lib/utils";
import Mascot from "@/components/gamification/Mascot";
import { useEffect, useState } from "react";

interface FinalSubmitSlideProps {
    lessonId: string;
    onComplete: () => void;
}

// Mascot component is now imported from @/components/gamification/Mascot

export default function FinalSubmitSlide({ lessonId, onComplete }: FinalSubmitSlideProps) {
    const [isSubmitting, setIsSubmitting] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const autoSubmit = async () => {
            try {
                const res = await fetch("/api/chapter/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ lessonId })
                });

                // Even if fetch fails, we'll show success to not block the user 
                // but usually it should succeed.
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#10b981', '#f59e0b', '#ffffff']
                });
                setIsSuccess(true);
                onComplete();
            } catch (err) {
                console.error(err);
                setIsSuccess(true); // Fallback to avoid getting stuck
            } finally {
                setIsSubmitting(false);
            }
        };

        const timer = setTimeout(autoSubmit, 1500); // Slight delay for the "submitting" transition
        return () => clearTimeout(timer);
    }, [lessonId, onComplete]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-10 p-6">
            <AnimatePresence mode="wait">
                {isSuccess ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8 flex flex-col items-center"
                    >
                        <div className="relative">
                            <Mascot pose="cheer" className="scale-[1.5]" />
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.5 }}
                                className="absolute -bottom-4 -right-4 bg-emerald-500 text-white p-4 rounded-full shadow-lg border-4 border-white"
                            >
                                <Trophy className="h-8 w-8" />
                            </motion.div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">ALHAMDULILLAH!</h2>
                            <p className="text-slate-500 font-bold text-xl">Kamu luar biasa! Chapter ini selesai.</p>
                        </div>

                        <div className="bg-emerald-50 px-8 py-6 rounded-[2.5rem] border-4 border-emerald-100 w-full max-w-sm flex items-center justify-between">
                            <div className="text-left">
                                <p className="text-emerald-600 font-black text-xs uppercase tracking-widest">Rewards</p>
                                <p className="text-emerald-800 font-black text-2xl">+150 XP</p>
                            </div>
                            <Star className="w-10 h-10 text-amber-400 fill-current animate-pulse" />
                        </div>

                        <button
                            onClick={() => router.push("/map")}
                            className="w-full max-w-sm py-6 bg-emerald-500 text-white rounded-[2.5rem] font-black text-2xl uppercase tracking-widest shadow-2xl shadow-emerald-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            LANJUTKAN <ChevronRight className="h-8 w-8 text-amber-300 stroke-[4]" />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="space-y-10 flex flex-col items-center"
                    >
                        <div className="relative">
                            <div className="h-32 w-32 bg-amber-50 rounded-[2.5rem] flex items-center justify-center text-amber-500 border-4 border-amber-100 rotate-3 animate-pulse">
                                <PartyPopper className="h-16 w-16" />
                            </div>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-4 border-4 border-dashed border-amber-200 rounded-full -z-10"
                            />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                                <Sparkles className="text-amber-400" /> MISI SELESAI! <Sparkles className="text-amber-400" />
                            </h2>
                            <p className="text-slate-500 font-bold max-w-md mx-auto">
                                Sedang mensubmit amalan hebatmu ke buku catatan kebaikan...
                            </p>
                        </div>

                        <div className="w-full max-w-sm bg-slate-100 rounded-full h-4 overflow-hidden border-2 border-white shadow-inner">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="h-full bg-emerald-500"
                            />
                        </div>

                        <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em] animate-pulse">
                            MOHON TUNGGU SEBENTAR
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
