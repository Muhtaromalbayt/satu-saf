"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen, Star, RefreshCw, LayoutGrid } from "lucide-react";
import ReciteSlide from "@/components/lesson/ReciteSlide";
import { useGamification } from "@/context/GamificationContext";
import BottomNav from "@/components/layout/BottomNav";

interface Verse {
    verseNo: number;
    verseText: string;
    targetString: string;
    translation: string;
}

interface Surah {
    id: string;
    name: string;
    verses: Verse[];
}

const TADARUS_SURAS: Surah[] = [
    {
        id: "al-ikhlas",
        name: "QS Al-Ikhlas",
        verses: [
            { verseNo: 1, verseText: "قُلْ هُوَ اللَّهُ أَحَدٌ", targetString: "Qul huwal laahu ahad", translation: "Katakanlah (Muhammad), Dialah Allah, Yang Maha Esa." },
            { verseNo: 2, verseText: "اللَّهُ الصَّمَدُ", targetString: "Allahush shamad", translation: "Allah tempat meminta segala sesuatu." },
            { verseNo: 3, verseText: "لَمْ يَلِدْ وَلَمْ يُولَدْ", targetString: "Lam yalid walam yuulad", translation: "(Allah) tidak beranak dan tidak pula diperanakkan." },
            { verseNo: 4, verseText: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", targetString: "Walam yakul lahu kufuwan ahad", translation: "Dan tidak ada sesuatu yang setara dengan Dia." },
        ]
    },
    {
        id: "al-falaq",
        name: "QS Al-Falaq",
        verses: [
            { verseNo: 1, verseText: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", targetString: "Qul a'udzu birabbil falaq", translation: "Katakanlah, Aku berlindung kepada Tuhan yang menguasai subuh (fajar)." },
            { verseNo: 2, verseText: "مِن شَرِّ مَا خَلَقَ", targetString: "Min syarri maa khalaq", translation: "Dari kejahatan (makhluk yang) Dia ciptakan." },
            { verseNo: 3, verseText: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", targetString: "Wa min syarri ghaasiqin idzaa waqab", translation: "Dan dari kejahatan malam apabila telah gelap gulita." },
            { verseNo: 4, verseText: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", targetString: "Wa min syarrin naffaatsaati fil 'uqad", translation: "Dan dari kejahatan (perempuan-perempuan) penyihir yang meniup pada buhul-buhul (talinya)." },
            { verseNo: 5, verseText: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", targetString: "Wa min syarri haasidin idzaa hasad", translation: "Dan dari kejahatan orang yang dengki apabila dia dengki." },
        ]
    },
    {
        id: "an-nas",
        name: "QS An-Nas",
        verses: [
            { verseNo: 1, verseText: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", targetString: "Qul a'udzu birabbin naas", translation: "Katakanlah, Aku berlindung kepada Tuhannya manusia." },
            { verseNo: 2, verseText: "مَلِكِ النَّاسِ", targetString: "Malikin naas", translation: "Raja manusia." },
            { verseNo: 3, verseText: "إِلَٰهِ النَّاسِ", targetString: "Ilaahin naas", translation: "Sembahan manusia." },
            { verseNo: 4, verseText: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", targetString: "Min syarril waswaasil khannaas", translation: "Dari kejahatan (bisikan) setan yang bersembunyi." },
            { verseNo: 5, verseText: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", targetString: "Alladzii yuwaswisu fii shuduurin naas", translation: "Yang membisikkan (kejahatan) ke dalam dada manusia." },
            { verseNo: 6, verseText: "مِنَ الْجِنَّةِ وَالنَّاسِ", targetString: "Minal jinnati wan naas", translation: "Dari (golongan) jin dan manusia." },
        ]
    },
    {
        id: "al-kautsar",
        name: "QS Al-Kautsar",
        verses: [
            { verseNo: 1, verseText: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", targetString: "Inna a'tainakal kautsar", translation: "Sungguh, Kami telah memberimu (Muhammad) nikmat yang banyak." },
            { verseNo: 2, verseText: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", targetString: "Fashalli lirabbika wanhar", translation: "Maka laksanakanlah sholat karena Tuhanmu, dan berkurbanlah (sebagai ibadah dan mendekatkan diri kepada Allah)." },
            { verseNo: 3, verseText: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", targetString: "Inna syaani'aka huwal abtar", translation: "Sungguh, orang-orang yang membencimu dialah yang terputus (dari rahmat Allah)." },
        ]
    }
];

export default function TadarusPage() {
    const { tadarusCount, incrementTadarus } = useGamification();
    const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
    const [verseIndex, setVerseIndex] = useState(0);
    const [completed, setCompleted] = useState(false);

    const handleSurahSelect = (surah: Surah) => {
        setSelectedSurah(surah);
        setVerseIndex(0);
        setCompleted(false);
    };

    const nextVerse = () => {
        if (!selectedSurah) return;
        if (verseIndex < selectedSurah.verses.length - 1) {
            setVerseIndex(prev => prev + 1);
            setCompleted(false);
        } else {
            // Finished surah
            setSelectedSurah(null);
            setVerseIndex(0);
            setCompleted(false);
        }
    };

    const handleComplete = (success: boolean) => {
        if (success && !completed) {
            setCompleted(true);
            incrementTadarus();
        }
    };

    const currentVerse = selectedSurah?.verses[verseIndex];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pb-20">
            {/* Header */}
            <header className="bg-white border-b p-6 sticky top-0 z-10 shadow-sm">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => selectedSurah ? setSelectedSurah(null) : null}
                            className={`transition-all ${selectedSurah ? 'bg-slate-100 p-2 rounded-full active:scale-90' : 'bg-primary/10 p-2 rounded-xl'}`}
                        >
                            {selectedSurah ? <ChevronLeft className="h-5 w-5 text-slate-600" /> : <BookOpen className="h-6 w-6 text-primary" />}
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">
                                {selectedSurah ? selectedSurah.name : "Tadarus Juz 30"}
                            </h1>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                {selectedSurah ? `Ayat ${verseIndex + 1} dari ${selectedSurah.verses.length}` : "Pilih Surat Untuk Mengaji"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-yellow-400/20 px-3 py-1.5 rounded-full border border-yellow-400/30">
                        <Star className="h-4 w-4 text-yellow-600 fill-current" />
                        <span className="font-bold text-yellow-700">{tadarusCount}</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center p-6">
                <AnimatePresence mode="wait">
                    {!selectedSurah ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-md grid grid-cols-1 gap-4"
                        >
                            <div className="flex items-center gap-2 text-slate-400 mb-2 px-2">
                                <LayoutGrid className="h-4 w-4" />
                                <span className="text-sm font-medium uppercase tracking-wider">Daftar Surat</span>
                            </div>
                            {TADARUS_SURAS.map((surah) => (
                                <button
                                    key={surah.id}
                                    onClick={() => handleSurahSelect(surah)}
                                    className="w-full bg-white p-6 rounded-3xl border-2 border-slate-100 flex items-center justify-between group active:scale-[0.98] transition-all hover:border-primary/30 hover:shadow-lg shadow-slate-200/50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            {surah.verses.length}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-slate-800 text-lg">{surah.name}</h3>
                                            <p className="text-xs text-muted-foreground">{surah.verses.length} Ayat</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-6 w-6 text-slate-300 group-hover:text-primary transition-colors" />
                                </button>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key={selectedSurah.id + verseIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-white"
                        >
                            <ReciteSlide
                                data={{
                                    surahName: `${selectedSurah.name} : ${verseIndex + 1}`,
                                    verseText: currentVerse!.verseText,
                                    targetString: currentVerse!.targetString,
                                    translation: currentVerse!.translation
                                }}
                                onComplete={handleComplete}
                            />

                            {completed && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-8 pt-6 border-t flex flex-col items-center gap-4"
                                >
                                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold flex items-center gap-2 animate-bounce text-sm">
                                        <Star className="h-4 w-4 fill-current" />
                                        Masha Allah! Lanjut?
                                    </div>
                                    <button
                                        onClick={nextVerse}
                                        className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        {verseIndex < selectedSurah.verses.length - 1 ? "AYAT BERIKUTNYA" : "SELESAI SURAT"}
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {!selectedSurah && (
                    <div className="mt-8 text-center text-muted-foreground flex items-center gap-2 opacity-60">
                        <RefreshCw className="h-4 w-4" />
                        <span className="text-xs font-medium">Progress Tadarus disimpan otomatis</span>
                    </div>
                )}
            </main>

            <BottomNav />
        </div>
    );
}
