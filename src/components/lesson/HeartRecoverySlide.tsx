"use client";

import { useState } from "react";
import ReciteSlide from "./ReciteSlide";
import { Heart, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

const RECOVERY_SURAH = {
    name: "QS Al-Ikhlas",
    verses: [
        { verseNo: 1, verseText: "قُلْ هُوَ اللَّهُ أَحَدٌ", targetString: "Qul huwal laahu ahad", translation: "Katakanlah (Muhammad), Dialah Allah, Yang Maha Esa." },
        { verseNo: 2, verseText: "اللَّهُ الصَّمَدُ", targetString: "Allahush shamad", translation: "Allah tempat meminta segala sesuatu." },
        { verseNo: 3, verseText: "لَمْ يَلِدْ وَلَمْ يُولَدْ", targetString: "Lam yalid walam yuulad", translation: "(Allah) tidak beranak dan tidak pula diperanakkan." },
        { verseNo: 4, verseText: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", targetString: "Walam yakul lahu kufuwan ahad", translation: "Dan tidak ada sesuatu yang setara dengan Dia." },
    ]
};

interface HeartRecoverySlideProps {
    onComplete: () => void;
    onCancel: () => void;
}

export default function HeartRecoverySlide({ onComplete, onCancel }: HeartRecoverySlideProps) {
    const [verseIndex, setVerseIndex] = useState(0);
    const [isRestored, setIsRestored] = useState(false);
    const [showNextButton, setShowNextButton] = useState(false);

    const currentVerse = RECOVERY_SURAH.verses[verseIndex];

    const handleVerseComplete = (success: boolean) => {
        if (success) {
            setShowNextButton(true);
        }
    };

    const handleNext = () => {
        if (verseIndex < RECOVERY_SURAH.verses.length - 1) {
            setVerseIndex(prev => prev + 1);
            setShowNextButton(false);
        } else {
            setIsRestored(true);
            setTimeout(onComplete, 2500);
        }
    };

    if (isRestored) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    className="relative"
                >
                    <Heart className="h-24 w-24 text-red-500 fill-current" />
                    <motion.div
                        animate={{ opacity: [0, 1, 0], scale: [1, 2, 3], y: [0, -60, -120] }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 flex items-center justify-center font-black text-red-500 text-4xl"
                    >
                        +1
                    </motion.div>
                </motion.div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-green-600 uppercase tracking-tighter">Alhamdulillah!</h2>
                    <p className="text-slate-600 font-medium whitespace-pre-line">
                        Satu surat telah selesai dibaca.{"\n"}
                        Hatimu kini telah pulih!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-md p-6">
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-red-500">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        <Heart className="h-8 w-8 fill-current" />
                    </motion.div>
                    <span className="font-black text-2xl uppercase tracking-tighter">Pulihkan Hati</span>
                </div>
                <div className="bg-red-50 px-4 py-2 rounded-2xl border border-red-100">
                    <p className="text-red-700 text-sm font-bold">
                        Selesaikan surat {RECOVERY_SURAH.name} untuk mendapatkan 1 Hati ❤️
                    </p>
                </div>
            </div>

            <div className="w-full bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        Ayat {verseIndex + 1} / {RECOVERY_SURAH.verses.length}
                    </span>
                </div>

                <ReciteSlide
                    key={verseIndex} // Re-mount for each verse to reset recitation state
                    data={{
                        ...currentVerse,
                        surahName: `${RECOVERY_SURAH.name} : ${currentVerse.verseNo}`
                    }}
                    onComplete={handleVerseComplete}
                />

                {showNextButton && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8"
                    >
                        <button
                            onClick={handleNext}
                            className="w-full py-4 bg-primary text-primary-foreground font-black rounded-2xl shadow-lg active:translate-y-1 transition-all flex items-center justify-center gap-2"
                        >
                            {verseIndex < RECOVERY_SURAH.verses.length - 1 ? "AYAT BERIKUTNYA" : "SELESAI & PULIHKAN"}
                        </button>
                    </motion.div>
                )}
            </div>

            {!showNextButton && (
                <button
                    onClick={onCancel}
                    className="text-slate-400 hover:text-red-500 font-bold text-sm transition-colors uppercase tracking-widest"
                >
                    Nanti saja, saya menyerah
                </button>
            )}
        </div>
    );
}
