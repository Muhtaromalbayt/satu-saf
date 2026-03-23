"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Heart, Star, Flame, User, Loader2, RefreshCw, Send, Smile, Camera, Sparkles, CheckCircle2 } from "lucide-react";
import Mascot from "@/components/gamification/Mascot";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { sounds } from "@/lib/utils/sounds";

interface Reaction {
    id: number;
    type: string;
    content: string;
    userName?: string;
}

interface FeedItem {
    id: number;
    userName: string;
    kelompok: string;
    deedName: string;
    message: string;
    streak: number;
    day: number;
    timestamp: string;
    evidenceUrl?: string;
    reactions: Reaction[];
    userId: string;
    status: string;
}

export default function LaporPakPage() {
    const { user } = useAuth();
    const { isMidnight } = useTheme();
    const [feed, setFeed] = useState<FeedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null);

    const fetchFeed = async () => {
        try {
            // Updated to show all groups for everyone as requested
            const url = '/api/habits/feed';
            const res = await fetch(url);
            if (!res.ok) throw new Error("Gagal mengambil data laporan");
            const data = await res.json();
            setFeed(data.feed || []);
        } catch (err) {
            console.error("Feed sync error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchFeed();
        const interval = setInterval(fetchFeed, 15000); // More frequent sync
        return () => clearInterval(interval);
    }, [user]);

    const handleReact = async (amalanId: number, emoji: string) => {
        try {
            const res = await fetch('/api/habits/react', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amalanId, type: 'emoji', content: emoji }),
            });
            if (res.ok) {
                fetchFeed();
            }
        } catch (err) {
            console.error(err);
        }
        setShowEmojiPicker(null);
    };

    return (
        <div className={cn(
            "min-h-screen pb-32 font-sans relative overflow-x-hidden transition-colors duration-1000",
            isMidnight ? "bg-slate-950" : "bg-[#F0F2F5]"
        )}>
            {/* Islamic Decorative Elements */}
            <div className="fixed top-20 left-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />
            <div className="fixed bottom-20 right-0 w-48 h-48 bg-primary/5 blur-3xl rounded-full pointer-events-none" />

            {/* Header */}
            <div className={cn(
                "sticky top-0 z-30 pt-6 pb-12 text-center rounded-b-[3rem] shadow-2xl relative overflow-hidden border-b-8 transition-colors duration-1000",
                isMidnight ? "bg-slate-900 border-slate-950/20" : "bg-emerald-900 border-emerald-950/20"
            )}>
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')] pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/20 mb-4 shadow-lg shadow-emerald-950/20"
                    >
                        <MessageCircle className="h-3.5 w-3.5 text-emerald-300" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Kabar Kebaikan Santri</span>
                    </motion.div>

                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                        Lapor Pak!
                    </h1>

                    <div className="flex flex-col items-center gap-1">
                        <p className="text-emerald-100/60 text-[10px] font-black uppercase tracking-[0.15em]">
                            Monitoring & Jurnal Amalan Ananda
                        </p>
                        <div className="h-1 w-8 bg-primary rounded-full mt-1" />
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <div className={cn("h-1.5 w-1.5 rounded-full", isLoading ? "bg-amber-400 animate-pulse" : "bg-emerald-400")} />
                    <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">
                        {isLoading ? "Menyinkronkan..." : "Data Ter-update"}
                    </span>
                </div>
            </div>

            {/* Background Pattern Wallpaper */}
            <div className={cn(
                "fixed inset-0 pointer-events-none bg-repeat transition-opacity duration-1000",
                isMidnight ? "opacity-[0.02] invert" : "opacity-[0.03]"
            )} style={{ backgroundImage: "url('https://whatsapp-wallpaper.com/wp-content/uploads/2021/05/WhatsApp-Wallpaper-Light-2.jpg')" }} />

            <main className="relative z-10 p-4 max-w-lg mx-auto space-y-6 pt-8">
                {user?.role === 'parent' && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={cn(
                            "p-5 rounded-3xl border-2 shadow-sm text-center mb-8 relative overflow-hidden transition-all duration-1000",
                            isMidnight ? "bg-indigo-500/10 border-indigo-500/20" : "bg-emerald-50/80 backdrop-blur-md border-emerald-100"
                        )}
                    >
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <Heart className={cn("h-12 w-12", isMidnight ? "text-indigo-400" : "text-emerald-900")} />
                        </div>
                        <p className={cn("text-sm font-black", isMidnight ? "text-slate-100" : "text-slate-800")}>Assalamu'alaikum, Wali <span className={isMidnight ? "text-indigo-400" : "text-emerald-700"}>{user.name.replace('Wali ', '')}</span>!</p>
                        <p className={cn("text-[10px] mt-1 uppercase tracking-widest font-bold", isMidnight ? "text-slate-500" : "text-slate-500")}>Memantau Perkembangan Kelompok {user.kelompok}</p>
                    </motion.div>
                )}

                <div className="space-y-6">
                    {isLoading && feed.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-6 text-[#075E54]/20">
                            <div className="relative">
                                <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 text-emerald-400" />
                                </div>
                            </div>
                            <p className="text-xs font-black uppercase tracking-[0.3em] animate-pulse">Memuat Berita Surga...</p>
                        </div>
                    ) : feed.length === 0 ? (
                        <div className={cn(
                            "text-center py-24 space-y-6 rounded-[3rem] border shadow-inner transition-all duration-1000",
                            isMidnight ? "bg-slate-900/40 border-slate-800/60" : "bg-white/40 backdrop-blur-sm border-white/60"
                        )}>
                            <Mascot pose="thinking" className="h-28 w-28 mx-auto opacity-20 grayscale" />
                            <div className="space-y-2">
                                <p className={cn(
                                    "text-xs font-black uppercase tracking-widest leading-relaxed transition-colors",
                                    isMidnight ? "text-slate-600" : "text-slate-400"
                                )}>
                                    Belum ada aktivitas santri ter-update.<br />
                                    <span className="text-[10px] text-slate-500">Mari terus doakan yang terbaik untuk mereka!</span>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {feed.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="flex flex-col items-start gap-1.5"
                                >
                                    {/* User Name Tag & Kelompok */}
                                    <div className="flex items-center gap-2 ml-4">
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-tighter opacity-80",
                                            isMidnight ? "text-indigo-400" : "text-emerald-800"
                                        )}>
                                            Ananda {item.userName}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <span className={cn(
                                                "text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase",
                                                isMidnight ? "bg-indigo-500/10 text-indigo-400" : "bg-emerald-100/50 text-emerald-700"
                                            )}>
                                                Kelompok {item.kelompok}
                                            </span>
                                            <span className={cn(
                                                "text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase",
                                                isMidnight ? "bg-amber-500/10 text-amber-500" : "bg-amber-100/50 text-amber-700"
                                            )}>
                                                Hari ke-{item.day}
                                            </span>
                                            {item.status === 'verified' && (
                                                <span className="text-[8px] bg-sky-500/10 px-1.5 py-0.5 rounded-md font-black text-sky-600 uppercase flex items-center gap-1 border border-sky-200">
                                                    <CheckCircle2 className="h-2.5 w-2.5" /> Terverifikasi
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bubble Chat Style */}
                                    <div className={cn(
                                        "p-1 rounded-[1.75rem] rounded-tl-none shadow-md relative max-w-[95%] border transition-colors duration-1000 group",
                                        isMidnight 
                                            ? "bg-slate-900 border-slate-800 shadow-slate-950/50" 
                                            : "bg-white border-slate-100 shadow-slate-200/50"
                                    )}>
                                        {/* Tail */}
                                        <div className={cn(
                                            "absolute top-0 left-0 w-4 h-4 -translate-x-1.5 transition-colors duration-1000",
                                            isMidnight ? "bg-slate-900" : "bg-white"
                                        )}
                                            style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />

                                        <div className="p-3.5 pb-7 min-w-[200px]">
                                            {/* Blurred Activity Photo */}
                                            {item.evidenceUrl && (
                                                <div className="mb-4 rounded-2xl overflow-hidden relative border border-slate-50 shadow-inner bg-slate-100 aspect-video flex items-center justify-center">
                                                    <img
                                                        src={item.evidenceUrl}
                                                        alt="Aktivitas Kebaikan"
                                                        className="w-full h-full object-cover blur-[12px] group-hover:blur-[2px] transition-all duration-700 ease-in-out scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors flex flex-col items-center justify-center gap-2">
                                                        <Camera className="h-10 w-10 text-white/60 drop-shadow-lg" />
                                                        <p className="text-[8px] font-black text-white/80 uppercase tracking-widest transition-opacity group-hover:opacity-0">Ketuk untuk Mengintip</p>
                                                    </div>
                                                    <div className="absolute top-3 right-3 bg-white/40 backdrop-blur-xl px-2.5 py-1 rounded-full text-[9px] font-black uppercase text-emerald-900 tracking-tighter">
                                                        Bukti Amalan
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-3">
                                                <p className={cn(
                                                    "text-sm leading-relaxed font-semibold transition-colors duration-1000",
                                                    isMidnight ? "text-slate-300" : "text-slate-800"
                                                )}>
                                                    {item.message}
                                                </p>

                                                {item.streak >= 3 && (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="flex items-center gap-2.5 bg-orange-50/50 p-2.5 rounded-2xl border border-orange-100/50"
                                                    >
                                                        <div className="h-8 w-8 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                                                            <Flame className="h-4.5 w-4.5 text-orange-500 fill-orange-500" />
                                                        </div>
                                                        <p className="text-[10px] text-orange-800 font-black italic leading-tight">
                                                            MasyaAllah Streak {item.streak} hari! <br />
                                                            <span className="text-[9px] font-bold text-orange-600/70 not-italic uppercase">Semangat Istiqomah ya Nak...</span>
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </div>

                                            {/* Timestamp & Status */}
                                            <div className="absolute bottom-2 right-4 flex items-center gap-1.5 opacity-40">
                                                <span className="text-[9px] text-slate-500 font-black tracking-tighter">
                                                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <div className="flex gap-[1px]">
                                                    <div className="w-[1.5px] h-[3.5px] bg-sky-500 rotate-45" />
                                                    <div className="w-[1.5px] h-[7px] bg-sky-500 rotate-45 -translate-y-[2px]" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Reactions Overlay */}
                                        {item.reactions && item.reactions.length > 0 && (
                                            <div className="absolute -bottom-4 right-3 flex -space-x-1.5 items-center">
                                                {item.reactions.slice(0, 5).map((r, i) => (
                                                    <motion.div
                                                        key={r.id}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className={cn(
                                                            "rounded-full p-1 shadow-md border flex items-center justify-center w-7 h-7",
                                                            isMidnight ? "bg-slate-800 border-slate-700" : "bg-white border-slate-50"
                                                        )}
                                                        style={{ zIndex: 10 + i }}
                                                    >
                                                        <span className="text-sm">{r.content}</span>
                                                    </motion.div>
                                                ))}
                                                {item.reactions.length > 5 && (
                                                    <div className="bg-slate-100 rounded-full px-1.5 py-0.5 shadow-sm border border-white text-[8px] font-black text-slate-400 z-20">
                                                        +{item.reactions.length - 5}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Universal Booster Action (Every Santri/Parent can boost) */}
                                    <div className="flex items-center gap-2 mt-2 ml-4">
                                        <button
                                            onClick={() => {
                                                sounds?.play("click");
                                                setShowEmojiPicker(showEmojiPicker === item.id ? null : item.id);
                                            }}
                                            className={cn(
                                                "p-2 rounded-2xl transition-all active:scale-90 flex items-center gap-1.5 border-2",
                                                showEmojiPicker === item.id
                                                    ? "bg-slate-900 border-slate-900 text-white"
                                                    : "bg-white border-slate-100 text-slate-400 hover:border-emerald-200 hover:text-emerald-500"
                                            )}
                                        >
                                            <Sparkles className={cn("h-4 w-4", showEmojiPicker === item.id ? "text-amber-400" : "text-emerald-500")} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Kirim Booster</span>
                                        </button>

                                        <AnimatePresence>
                                            {showEmojiPicker === item.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20, scale: 0.8 }}
                                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                                    exit={{ opacity: 0, x: -20, scale: 0.8 }}
                                                    className={cn(
                                                        "flex gap-2.5 backdrop-blur-xl rounded-2xl p-2 px-4 shadow-2xl border z-50",
                                                        isMidnight ? "bg-slate-800/90 border-slate-700 shadow-slate-950" : "bg-white/90 border-white shadow-emerald-900/5"
                                                    )}
                                                >
                                                    {['🔥', '💎', '🙌', '🚀', '🕌'].map(emoji => (
                                                        <button
                                                            key={emoji}
                                                            onClick={() => {
                                                                sounds?.play("success");
                                                                handleReact(item.id, emoji);
                                                            }}
                                                            className="hover:scale-150 active:scale-125 transition-all text-xl"
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                <div className="py-20 text-center space-y-4">
                    <div className="h-px w-20 bg-slate-200 mx-auto" />
                    <p className="italic text-slate-400 text-[11px] font-medium px-8 leading-relaxed">
                        "Setiap kebaikan yang ananda lakukan adalah butiran tasbih <br className="hidden sm:block" /> dalam istighfar yang menghapus kesalahan."
                    </p>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest opacity-60">
                        HR. Al-Mu'jam Al-Awsat
                    </p>
                </div>
            </main>
        </div>
    );
}
