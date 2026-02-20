
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PartyPopper, CheckCircle2, ChevronRight, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

interface FinalSubmitSlideProps {
    lessonId: string;
    onComplete: () => void;
}

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

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-6">
                <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="relative"
                >
                    <div className="h-48 w-48 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Trophy className="h-24 w-24 text-emerald-500" />
                    </div>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -top-4 -right-4 h-12 w-12 bg-amber-400 rounded-full flex items-center justify-center text-white shadow-lg"
                    >
                        <PartyPopper className="h-6 w-6" />
                    </motion.div>
                </motion.div>

                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight">ALHAMDULILLAH!</h2>
                    <p className="text-slate-500 font-bold text-lg">Kamu telah menyelesaikan bab ini dengan baik.</p>
                </div>

                <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-100 w-full max-w-sm">
                    <div className="flex items-center justify-between text-emerald-700 font-black uppercase text-xs tracking-widest">
                        <span>Poin Diperoleh</span>
                        <span className="text-xl">+150 XP</span>
                    </div>
                </div>

                <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full max-w-sm py-5 bg-emerald-500 text-white rounded-[2rem] font-black text-xl uppercase tracking-widest shadow-xl shadow-emerald-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    KE DASHBOARD <ChevronRight className="h-6 w-6" />
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-12 p-6">
            <div className="space-y-4">
                <div className="h-32 w-32 bg-indigo-100 rounded-[2.5rem] flex items-center justify-center text-indigo-500 mx-auto rotate-3">
                    <CheckCircle2 className="h-16 w-16" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">SIAP SELESAIKAN CHAPTER?</h2>
                <p className="text-slate-500 font-medium">Pastikan kamu telah memahami semua materi dan menyelesaikan amalan yaumi.</p>
            </div>

            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`
                    w-full max-w-sm py-6 rounded-[2.5rem] font-black text-2xl uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3
                    ${isSubmitting ? "bg-slate-100 text-slate-400" : "bg-primary text-white shadow-primary/30 hover:scale-105 active:scale-95"}
                `}
            >
                {isSubmitting ? "MENGIRIM..." : (
                    <>
                        SUBMIT CHAPTER <ChevronRight className="h-8 w-8 text-amber-300" />
                    </>
                )}
            </button>
        </div>
    );
}
