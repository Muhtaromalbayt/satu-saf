"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Flame, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface StreakPopupProps {
    streak: number;
    onClose: () => void;
}

export default function StreakPopup({ streak, onClose }: StreakPopupProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    const quotes = [
        "Barangsiapa meniti jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju Surga.",
        "Ilmu itu cahaya, dan cahaya Allah tidak akan diberikan kepada pelaku maksiat.",
        "Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya.",
        "Setiap langkahmu menuju kebaikan adalah pahala yang terus mengalir."
    ];

    const randomQuote = quotes[streak % quotes.length];

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                        className="bg-white rounded-[3rem] p-8 w-full max-w-sm flex flex-col items-center text-center shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-orange-50 to-transparent -z-10" />

                        <div className="relative mb-8">
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    filter: ["drop-shadow(0 0 0px #f97316)", "drop-shadow(0 0 20px #f97316)", "drop-shadow(0 0 0px #f97316)"]
                                }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="h-40 w-40 bg-orange-100 rounded-full flex items-center justify-center border-8 border-white shadow-2xl"
                            >
                                <Flame className="h-24 w-24 text-orange-500 fill-orange-500" />
                            </motion.div>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-2 rounded-2xl font-black text-2xl border-4 border-white shadow-xl"
                            >
                                {streak} HARI
                            </motion.div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Streak Menyala!</h2>
                            <div className="relative p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <Quote className="h-6 w-6 text-slate-200 absolute top-2 left-2" />
                                <p className="text-slate-600 font-medium italic text-sm leading-relaxed">
                                    "{randomQuote}"
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="secondary"
                            fullWidth
                            size="lg"
                            className="h-16 text-xl"
                            onClick={onClose}
                        >
                            MANTAP!
                        </Button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
