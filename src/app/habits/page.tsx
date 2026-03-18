"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Heart, Star, Flame, User, Loader2, RefreshCw, Send, Smile, Camera } from "lucide-react";
import Mascot from "@/components/gamification/Mascot";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";

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
    timestamp: string;
    evidenceUrl?: string;
    reactions: Reaction[];
    userId: string;
}

export default function LaporPakPage() {
    const { user } = useAuth();
    const [feed, setFeed] = useState<FeedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null);

    const fetchFeed = async () => {
        setIsLoading(true);
        try {
            const url = user?.role === 'parent'
                ? `/api/habits/feed?kelompok=${user.kelompok}`
                : '/api/habits/feed';
            const res = await fetch(url);
            const data = await res.json();
            setFeed(data.feed || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();
        const interval = setInterval(fetchFeed, 30000);
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
                fetchFeed(); // Refresh to show new reaction
            }
        } catch (err) {
            console.error(err);
        }
        setShowEmojiPicker(null);
    };

    return (
        <div className="min-h-screen bg-[#E5DDD5] pb-32 font-sans relative">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-emerald-900 p-5 pb-10 text-center rounded-b-[2.5rem] shadow-xl relative overflow-hidden border-b-4 border-emerald-950/30">
                <motion.div
                    initial={{ scale: 0, rotate: -12 }}
                    animate={{ scale: 1, rotate: 12 }}
                    className="absolute -top-2 -right-2 text-white/10"
                >
                    <MessageCircle className="h-32 w-32" />
                </motion.div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 mb-3">
                        <MessageCircle className="h-3 w-3 text-emerald-300" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Laporan Santri</span>
                    </div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                        Lapor Pak!
                    </h1>
                    <p className="text-emerald-100/60 text-[10px] font-bold uppercase tracking-widest mt-2">
                        Monitoring & Kabar Baik Ananda
                    </p>
                </div>
            </div>

            {/* Background Pattern Wallpaper */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.05] bg-[url('https://whatsapp-wallpaper.com/wp-content/uploads/2021/05/WhatsApp-Wallpaper-Light-2.jpg')] bg-repeat" />

            <main className="relative z-10 p-4 max-w-lg mx-auto space-y-4">
                {user?.role === 'parent' && (
                    <div className="bg-[#DCF8C6]/80 backdrop-blur-sm p-4 rounded-xl border border-[#C7E9B0] shadow-sm text-center mb-6">
                        <p className="text-xs font-bold text-slate-800">Assalamu'alaikum, Wali <span className="text-emerald-700">{user.name.replace('Wali ', '')}</span>!</p>
                        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">Memantau Kebaikan Ananda di {user.kelompok}</p>
                    </div>
                )}

                <div className="space-y-4">
                    {isLoading && feed.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 text-[#075E54]/40">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <p className="text-xs font-black uppercase tracking-widest">Memuat Hubungan Surga...</p>
                        </div>
                    ) : feed.length === 0 ? (
                        <div className="text-center py-20 space-y-4">
                            <Mascot pose="thinking" className="h-24 w-24 mx-auto opacity-30 grayscale" />
                            <p className="text-xs font-black text-[#075E54]/40 uppercase tracking-widest leading-relaxed">Belum ada aktivitas santri yang tercatat.<br />Tetap doakan mereka, ya!</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {feed.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex flex-col items-start gap-1"
                                >
                                    {/* User Name Tag */}
                                    <span className="text-[10px] font-black text-[#075E54] ml-3 uppercase tracking-tighter opacity-70">
                                        Ananda {item.userName}
                                    </span>

                                    {/* Bubble Chat Style */}
                                    <div className="bg-white p-1 rounded-2xl rounded-tl-none shadow-sm relative max-w-[90%] border-b-2 border-slate-200/50">
                                        {/* Tail */}
                                        <div className="absolute top-0 left-0 w-3 h-3 bg-white -translate-x-1.5"
                                            style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />

                                        <div className="p-3 pb-6">
                                            {/* Blurred Activity Photo */}
                                            {item.evidenceUrl && (
                                                <div className="mb-3 rounded-xl overflow-hidden relative border border-slate-100 shadow-inner group">
                                                    <img
                                                        src={item.evidenceUrl}
                                                        alt="Aktivitas"
                                                        className="w-full h-40 object-cover blur-[8px] hover:blur-[2px] transition-all duration-500 scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                                        <Camera className="h-8 w-8 text-white/50" />
                                                    </div>
                                                    <div className="absolute top-2 right-2 bg-white/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[8px] font-bold uppercase text-slate-700">Live Photo</div>
                                                </div>
                                            )}

                                            <div className="space-y-1">
                                                <p className="text-sm text-slate-800 leading-snug font-medium">
                                                    {item.message}
                                                </p>
                                                {item.streak >= 3 && (
                                                    <div className="flex items-center gap-1.5 mt-2 bg-amber-50 p-2 rounded-xl border border-amber-100">
                                                        <Flame className="h-4 w-4 text-amber-500" />
                                                        <p className="text-[10px] text-amber-700 font-black italic">
                                                            Streak {item.streak} hari! Masyaallah tabarakallah...
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Timestamp & Status */}
                                            <div className="absolute bottom-1 right-3 flex items-center gap-1">
                                                <span className="text-[9px] text-slate-400 font-bold">
                                                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <div className="flex gap-[1px]">
                                                    <div className="w-[1.5px] h-[3px] bg-sky-400 rotate-45" />
                                                    <div className="w-[1.5px] h-[6px] bg-sky-400 rotate-45 -translate-y-[2px]" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Reactions Overlay */}
                                        {item.reactions && item.reactions.length > 0 && (
                                            <div className="absolute -bottom-3 right-2 flex -space-x-1">
                                                {item.reactions.map((r, i) => (
                                                    <div key={r.id} className="bg-white rounded-full p-0.5 shadow-sm border border-slate-100 animate-in zoom-in-50 duration-300" style={{ zIndex: 10 + i }}>
                                                        <span className="text-sm">{r.content}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Parent Action (Wali Only) */}
                                    {user?.role === 'parent' && (
                                        <div className="flex items-center gap-2 mt-1 ml-2">
                                            <button
                                                onClick={() => setShowEmojiPicker(showEmojiPicker === item.id ? null : item.id)}
                                                className="p-1.5 bg-white/50 hover:bg-white rounded-full transition-colors group"
                                            >
                                                <Smile className="h-4 w-4 text-slate-400 group-hover:text-primary" />
                                            </button>

                                            <AnimatePresence>
                                                {showEmojiPicker === item.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -10 }}
                                                        className="flex gap-2 bg-white rounded-full p-1 px-3 shadow-lg border border-slate-100"
                                                    >
                                                        {['❤️', '👍', '🔥', '👏', '🙌'].map(emoji => (
                                                            <button
                                                                key={emoji}
                                                                onClick={() => handleReact(item.id, emoji)}
                                                                className="hover:scale-125 transition-transform text-base"
                                                            >
                                                                {emoji}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </main>

            <div className="p-10 text-center italic text-slate-500 text-[10px] opacity-60">
                "Setiap kebaikan adalah sedekah." (HR. Bukhari & Muslim)
            </div>
        </div>
    );
}
