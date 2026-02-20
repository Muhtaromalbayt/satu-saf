"use client";

import { motion } from "framer-motion";
import TarteelEngine from "./TarteelEngine";

interface TarteelSlideProps {
    data: {
        surahName: string;
        verseText: string;
        targetString: string; // This should be the clean Arabic text for matching
        translation?: string;
    };
    onComplete: (success: boolean) => void;
}

export default function TarteelSlide({ data, onComplete }: TarteelSlideProps) {
    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto p-4 space-y-10 items-center text-center">
            {/* Context Header */}
            <div className="space-y-4">
                <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full font-black text-xs uppercase tracking-widest shadow-sm"
                >
                    {data.surahName}
                </motion.span>

                {data.translation && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 font-bold italic text-lg"
                    >
                        "{data.translation}"
                    </motion.p>
                )}
            </div>

            {/* The Engine */}
            <TarteelEngine
                targetVerse={data.verseText}
                targetTranscript={data.targetString || data.verseText}
                onComplete={() => {
                    setTimeout(() => onComplete(true), 1500);
                }}
            />

            {/* Tips / Instructions */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-4"
            >
                <div className="bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <p className="text-slate-500 font-bold text-sm">
                        Bacalah ayat di atas dengan suara jelas dan tartil.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
