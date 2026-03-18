"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Save, Loader2, ChevronRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
    const [currentDay, setCurrentDay] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/admin/settings");
            const data = await res.json();
            if (data.currentDay) {
                setCurrentDay(data.currentDay);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentDay }),
            });
            if (res.ok) {
                setMessage({ type: 'success', text: "Pengaturan berhasil disimpan!" });
            } else {
                throw new Error("Gagal menyimpan");
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Terjadi kesalahan saat menyimpan." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
            <header>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <Calendar className="h-8 w-8 text-primary" />
                    </div>
                    Pengaturan Journey
                </h1>
                <p className="text-slate-500 mt-2 font-medium">Atur hari pengerjaan yang aktif untuk seluruh santri.</p>
            </header>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <section className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Hari Perjalanan Aktif</h2>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Status: Day {currentDay} is Open</p>
                            </div>
                            <div className="h-16 w-16 bg-primary/5 rounded-3xl flex items-center justify-center border-2 border-primary/20">
                                <span className="text-2xl font-black text-primary">{currentDay}</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="relative h-12 flex items-center group">
                                <input
                                    type="range"
                                    min="1"
                                    max="14"
                                    value={currentDay}
                                    onChange={(e) => setCurrentDay(parseInt(e.target.value))}
                                    className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary"
                                />
                                <div className="absolute -top-6 left-0 right-0 flex justify-between px-1">
                                    {Array.from({ length: 14 }, (_, i) => i + 1).map(d => (
                                        <span key={d} className={cn(
                                            "text-[10px] font-black transition-colors",
                                            d === currentDay ? "text-primary scale-125" : "text-slate-300"
                                        )}>
                                            {d}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-2">
                                {Array.from({ length: 14 }, (_, i) => i + 1).map(day => (
                                    <button
                                        key={day}
                                        onClick={() => setCurrentDay(day)}
                                        className={cn(
                                            "h-12 rounded-xl font-black text-sm transition-all border-2",
                                            currentDay === day
                                                ? "bg-primary text-white border-primary shadow-lg scale-105"
                                                : "bg-white text-slate-400 border-slate-100 hover:border-primary/30"
                                        )}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                            {message && (
                                <motion.p
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={cn(
                                        "text-sm font-bold",
                                        message.type === 'success' ? "text-emerald-500" : "text-rose-500"
                                    )}
                                >
                                    {message.text}
                                </motion.p>
                            )}
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="ml-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-lg hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95"
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Simpan Pengaturan
                            </button>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="bg-amber-50 p-6 rounded-[2rem] border-2 border-amber-100">
                        <h3 className="text-amber-700 font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
                            <Info className="h-4 w-4" /> Penting
                        </h3>
                        <ul className="space-y-3 text-sm text-amber-800/80 font-medium">
                            <li className="flex gap-2">
                                <ChevronRight className="h-4 w-4 flex-shrink-0 text-amber-500 mt-0.5" />
                                Mengubah hari aktif akan **membuka** akses pengerjaan untuk hari tersebut.
                            </li>
                            <li className="flex gap-2">
                                <ChevronRight className="h-4 w-4 flex-shrink-0 text-amber-500 mt-0.5" />
                                Santri hanya bisa mengerjakan tugas pada hari yang sedang aktif atau hari sebelumnya.
                            </li>
                            <li className="flex gap-2">
                                <ChevronRight className="h-4 w-4 flex-shrink-0 text-amber-500 mt-0.5" />
                                Hari di atas hari aktif akan menampilkan icon **Terkunci**.
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
