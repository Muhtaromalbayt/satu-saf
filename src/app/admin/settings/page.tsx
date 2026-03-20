"use client";

import { useState, useEffect } from "react";
import {
    Save,
    Plus,
    Trash2,
    Flame,
    Info,
    CheckCircle2,
    AlertCircle,
    RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface StreakRule {
    days: number;
    points: number;
}

export default function AdminSettingsPage() {
    const [streakRules, setStreakRules] = useState<StreakRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/settings/streak");
            if (res.ok) {
                const data = await res.json();
                setStreakRules(data);
            }
        } catch (err) {
            console.error("Fetch settings error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/settings/streak", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(streakRules)
            });

            if (res.ok) {
                setToast({ type: 'success', message: "Pengaturan berhasil disimpan!" });
            } else {
                setToast({ type: 'error', message: "Gagal menyimpan pengaturan." });
            }
        } catch (err) {
            setToast({ type: 'error', message: "Terjadi kesalahan jaringan." });
        } finally {
            setSaving(false);
            setTimeout(() => setToast(null), 3000);
        }
    };

    const addRule = () => {
        setStreakRules([...streakRules, { days: 0, points: 0 }]);
    };

    const removeRule = (index: number) => {
        setStreakRules(streakRules.filter((_, i) => i !== index));
    };

    const updateRule = (index: number, field: keyof StreakRule, value: number) => {
        const newRules = [...streakRules];
        newRules[index] = { ...newRules[index], [field]: value };
        setStreakRules(newRules);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20 text-slate-400">
                <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-10 group">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Pengaturan Sistem</h1>
                    <p className="text-slate-500 font-medium text-lg">Konfigurasi poin, streak, dan parameter gamifikasi lainnya.</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-2xl font-black bg-primary hover:bg-primary-hover h-14 px-8 shadow-xl shadow-primary/20 active:scale-95 transition-all"
                >
                    {saving ? <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                    Simpan Semua Perubahan
                </Button>
            </header>

            <div className="grid grid-cols-1 gap-10">
                {/* Streak Bonus Card */}
                <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-sm overflow-hidden p-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-14 w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                            <Flame className="h-8 w-8 text-orange-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900">Mekanisme Streak Poin</h3>
                            <p className="text-slate-400 font-bold text-sm tracking-tight">Bonus XP tambahan saat santri mencapai target hari tertentu.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {streakRules.sort((a, b) => a.days - b.days).map((rule, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-orange-500/20 transition-all group/item"
                                >
                                    <div className="flex-1 grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Jumlah Hari</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={rule.days}
                                                    onChange={(e) => updateRule(idx, 'days', parseInt(e.target.value) || 0)}
                                                    className="w-full bg-white border-2 border-slate-100 focus:border-orange-400 outline-none rounded-xl px-4 py-3 font-black text-slate-700 transition-all pl-10"
                                                />
                                                <Flame className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-400" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Bonus XP</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={rule.points}
                                                    onChange={(e) => updateRule(idx, 'points', parseInt(e.target.value) || 0)}
                                                    className="w-full bg-white border-2 border-slate-100 focus:border-emerald-400 outline-none rounded-xl px-4 py-3 font-black text-emerald-600 transition-all pl-10"
                                                />
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-emerald-400 text-xs">+</div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeRule(idx)}
                                        className="h-12 w-12 flex items-center justify-center rounded-xl hover:bg-rose-500/10 text-slate-300 hover:text-rose-500 transition-all mt-5"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <button
                            onClick={addRule}
                            className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-100 text-slate-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            <Plus className="h-4 w-4" /> Tambah Aturan Streak
                        </button>
                    </div>

                    <div className="mt-10 p-6 bg-blue-50/50 rounded-3xl border-2 border-blue-100/50 flex gap-4">
                        <Info className="h-6 w-6 text-blue-500 shrink-0" />
                        <div className="text-xs font-bold text-blue-700/70 leading-relaxed">
                            Poin bonus akan ditambahkan ke total nilai saat proses <span className="text-blue-800 font-black">Sync Leaderboard</span> dijalankan di halaman Rekap Nilai. Bonus hanya diambil dari aturan streak tertinggi yang tercapai.
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className={cn(
                            "fixed bottom-8 left-1/2 -translate-x-1/2 p-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[100] border-2 no-wrap min-w-[300px]",
                            toast.type === 'success' ? "bg-emerald-600 border-emerald-500 text-white" : "bg-rose-600 border-rose-500 text-white"
                        )}
                    >
                        {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        <p className="font-black text-sm uppercase tracking-tight">{toast.message}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
