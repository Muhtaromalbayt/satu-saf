
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, CheckCircle2, ChevronRight, Trophy, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import confetti from 'canvas-confetti';
import { cn } from "@/lib/utils";

interface FinalSubmitSlideProps {
    lessonId: string;
    onComplete: () => void;
}

const Mascot = () => (
    <motion.div
        animate={{
            y: [0, -10, 0],
            rotate: [-2, 2, -2]
        }}
        transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
        }}
        className="relative w-48 h-48 flex items-center justify-center"
    >
        {/* Simple Mascot SVG / Illustration Placeholder */}
        <div className="absolute inset-0 bg-emerald-100 rounded-[3rem] rotate-6" />
        <div className="absolute inset-0 bg-amber-100 rounded-[3rem] -rotate-3 opacity-50" />
        <div className="z-10 bg-white p-6 rounded-[2.5rem] shadow-xl border-4 border-emerald-500 flex flex-col items-center gap-2">
            <div className="flex gap-2 mb-2">
                <motion.div
                    animate={{ scaleY: [1, 0.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2, times: [0, 0.1, 0.2] }}
                    className="w-3 h-4 bg-emerald-600 rounded-full"
                />
                <motion.div
                    animate={{ scaleY: [1, 0.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2, times: [0, 0.1, 0.2] }}
                    className="w-3 h-4 bg-emerald-600 rounded-full"
                />
            </div>
            <div className="w-8 h-4 border-b-4 border-emerald-600 rounded-full" />
        </div>

        {/* Floating Stars */}
        {[0, 1, 2].map(i => (
            <motion.div
                key={i}
                animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5]
                }}
                transition={{
                    repeat: Infinity,
                    duration: 2 + i,
                    delay: i * 0.5
                }}
                className="absolute text-amber-400"
                style={{
                    top: i === 0 ? -10 : i === 1 ? 40 : 100,
                    right: i === 0 ? -10 : i === 1 ? -30 : 140
                }}
            >
                <Star className="fill-current w-6 h-6" />
            </motion.div>
        ))}
    </motion.div>
);

export default function FinalSubmitSlide({ lessonId, onComplete }: FinalSubmitSlideProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/chapter/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lessonId })
            });
            if (res.ok) {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#10b981', '#f59e0b', '#ffffff']
                });
                setIsSuccess(true);
                onComplete();
            } else {
                alert("Gagal mengirim progres. Silakan coba lagi.");
            }
        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan jaringan.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                            <Mascot />
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
                            <Star className="w-10 h-10 text-amber-400 fill-current" />
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
                        <div className="h-32 w-32 bg-amber-50 rounded-[2.5rem] flex items-center justify-center text-amber-500 border-4 border-amber-100 rotate-3 animate-pulse">
                            <PartyPopper className="h-16 w-16" />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-slate-800 tracking-tight">SELESAIKAN MISI?</h2>
                            <p className="text-slate-500 font-bold max-w-md mx-auto">
                                Kamu telah melalui perjalanan hebat hari ini. Siap mensubmit amalanmu?
                            </p>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={cn(
                                "w-full max-w-sm py-8 rounded-[2.5rem] font-black text-3xl uppercase tracking-widest shadow-2xl transition-all flex flex-col items-center gap-1",
                                isSubmitting
                                    ? "bg-slate-100 text-slate-400 shadow-none"
                                    : "bg-emerald-500 text-white shadow-emerald-200 hover:scale-105 active:scale-95"
                            )}
                        >
                            <span>{isSubmitting ? "MENGIRIM..." : "SUBMIT CHAPTER"}</span>
                            {!isSubmitting && <span className="text-[10px] opacity-70 tracking-[0.3em]">TAP UNTUK SELESAI</span>}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
