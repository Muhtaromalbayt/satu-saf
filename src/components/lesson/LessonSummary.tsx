"use client";

import { motion } from "framer-motion";
import { Award, Heart, Zap, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Mascot from "@/components/gamification/Mascot";

interface LessonSummaryProps {
    xp: number;
    hearts: number;
    streak: number;
    onFinish: () => void;
}

export default function LessonSummary({ xp, hearts, streak, onFinish }: LessonSummaryProps) {
    return (
        <div className="flex flex-col items-center justify-center p-6 space-y-8 w-full max-w-md text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
            >
                <div className="relative group">
                    <div className="h-32 w-32 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg relative z-10 overflow-visible">
                        <Award className="h-20 w-20 text-white" />

                        {/* Mascot Integrated into the award area */}
                        <div className="absolute -bottom-4 -right-10 z-20 pointer-events-none transform group-hover:scale-110 transition-transform duration-300">
                            <Mascot pose="cheer" className="scale-[0.85]" />
                        </div>
                    </div>

                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full z-30 shadow-md"
                    >
                        PERFECT!
                    </motion.div>

                    {/* Decorative back-glow to ground the integrated mascot */}
                    <div className="absolute -bottom-2 -right-8 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl -z-0" />
                </div>
            </motion.div>

            <h1 className="text-3xl font-bold text-slate-800">Lesson Complete!</h1>

            <div className="grid grid-cols-3 gap-4 w-full">
                <div className="flex flex-col items-center bg-yellow-50 p-4 rounded-2xl border-2 border-yellow-200 shadow-sm">
                    <Zap className="h-8 w-8 text-yellow-500 mb-1" />
                    <span className="text-lg font-bold text-yellow-700">+{xp}</span>
                    <span className="text-xs text-yellow-600 font-medium uppercase">XP</span>
                </div>
                <div className="flex flex-col items-center bg-red-50 p-4 rounded-2xl border-2 border-red-200 shadow-sm">
                    <Heart className="h-8 w-8 text-red-500 mb-1" />
                    <span className="text-lg font-bold text-red-700">{hearts}</span>
                    <span className="text-xs text-red-600 font-medium uppercase">HEARTS</span>
                </div>
                <div className="flex flex-col items-center bg-orange-50 p-4 rounded-2xl border-2 border-orange-200 shadow-sm">
                    <RotateCcw className="h-8 w-8 text-orange-500 mb-1" />
                    <span className="text-lg font-bold text-orange-700">{streak}</span>
                    <span className="text-xs text-orange-600 font-medium uppercase">STREAK</span>
                </div>
            </div>

            <div className="w-full space-y-4 pt-4">
                <Button
                    onClick={onFinish}
                    className="w-full py-6 bg-green-500 hover:bg-green-600 text-white font-bold text-xl rounded-2xl shadow-[0_4px_0_rgb(21,128,61)] transition-all active:translate-y-1 active:shadow-none"
                >
                    CONTINUE
                </Button>
            </div>
        </div>
    );
}
