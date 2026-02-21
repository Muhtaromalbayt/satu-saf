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
        <div className="flex flex-col h-full max-w-4xl mx-auto p-4 space-y-12 items-center text-center">
            {/* Context Header */}
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-8 py-3 bg-amber-100 text-amber-700 rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-sm border-2 border-amber-200/50"
                >
                    {data.surahName}
                </motion.div>

                {data.translation && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 font-bold italic text-xl md:text-2xl leading-relaxed max-w-2xl"
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
                className="w-full max-w-lg"
            >
                <div className="bg-emerald-50 border-4 border-emerald-100 p-6 rounded-[2rem] flex items-center gap-4 shadow-xl shadow-emerald-100/50">
                    <div className="h-4 w-4 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <p className="text-emerald-700 font-black text-left text-sm leading-tight uppercase tracking-wide">
                        Bacalah ayat di atas dengan suara jelas dan tartil. Teks akan berubah hijau saat terbaca.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
