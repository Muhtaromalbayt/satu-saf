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
    RefreshCw,
    Calendar,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface StreakRule {
    days: number;
    points: number;
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<{
        streak_config: StreakRule[];
        mission_start_date: string;
        current_journey_day: string;
        scoring_weight: {
            hafalan: number;
            ujianTulis: number;
            qiyamullail: number;
            monitoring: number;
        };
    }>({
        streak_config: [],
        mission_start_date: "",
        current_journey_day: "1",
        scoring_weight: {
            hafalan: 15,
            ujianTulis: 15,
            qiyamullail: 20,
            monitoring: 50
        }
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/settings");
            if (res.ok) {
                const data = await res.json();
                setSettings({
                    streak_config: data.streak_config || [],
                    mission_start_date: data.mission_start_date || "",
                    current_journey_day: data.current_journey_day || "1",
                    scoring_weight: data.scoring_weight || {
                        hafalan: 15,
                        ujianTulis: 15,
                        qiyamullail: 20,
                        monitoring: 50
                    }
                });
            }
        } catch (err) {
            console.error("Fetch settings error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        // Validation: Sum of weights must be 100
        const { scoring_weight } = settings;
        const totalWeight = scoring_weight.hafalan + scoring_weight.ujianTulis + scoring_weight.qiyamullail + scoring_weight.monitoring;

        if (totalWeight !== 100) {
            setToast({ type: 'error', message: `Total bobot harus 100% (saat ini: ${totalWeight}%)` });
            setTimeout(() => setToast(null), 3000);
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings)
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
        setSettings({
            ...settings,
            streak_config: [...settings.streak_config, { days: 0, points: 0 }]
        });
    };

    const removeRule = (index: number) => {
        setSettings({
            ...settings,
            streak_config: settings.streak_config.filter((_, i) => i !== index)
        });
    };

    const updateRule = (index: number, field: keyof StreakRule, value: number) => {
        const newRules = [...settings.streak_config];
        newRules[index] = { ...newRules[index], [field]: value };
        setSettings({ ...settings, streak_config: newRules });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20 text-slate-400">
                <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-10 group pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Pengaturan Sistem</h1>
                    <p className="text-slate-500 font-medium text-lg">Konfigurasi poin, streak, dan jadwal monitoring.</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-2xl font-black bg-primary hover:bg-primary-hover h-14 px-8 shadow-xl shadow-primary/20 active:scale-95 transition-all"
                >
                    {saving ? <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                    Simpan Perubahan
                </Button>
            </header>

            <div className="grid grid-cols-1 gap-10">

                {/* Monitoring Schedule Card */}
                <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-sm overflow-hidden p-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                            <Calendar className="h-8 w-8 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900">Jadwal Pelaksanaan</h3>
                            <p className="text-slate-400 font-bold text-sm tracking-tight">Atur kapan monitoring dimulai dan hari keberapa saat ini.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Tanggal Mulai Monitoring</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={settings.mission_start_date}
                                    onChange={(e) => setSettings({ ...settings, mission_start_date: e.target.value })}
                                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-blue-400 outline-none rounded-2xl px-5 py-4 font-black text-slate-700 transition-all"
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium pl-2 italic">Format: Tahun-Bulan-Hari (Y-M-D)</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Hari Berjalan (Current Day)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="1"
                                    max="14"
                                    value={settings.current_journey_day}
                                    onChange={(e) => setSettings({ ...settings, current_journey_day: e.target.value })}
                                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-blue-400 outline-none rounded-2xl px-5 py-4 font-black text-slate-700 transition-all font-mono text-xl"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded-lg border border-slate-100 text-[10px] font-black text-blue-500">
                                    DAY {settings.current_journey_day}
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium pl-2 italic">Maksimal 14 hari sesuai peta karunia.</p>
                        </div>
                    </div>
                </div>

                {/* Scoring Weights Card */}
                <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-sm overflow-hidden p-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                            <Clock className="h-8 w-8 text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900">Pembobotan Nilai</h3>
                            <p className="text-slate-400 font-bold text-sm tracking-tight">Tentukan persentase pengaruh tiap aspek terhadap nilai akhir (Total harus 100%).</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { id: 'hafalan', label: 'Hafalan' },
                            { id: 'ujianTulis', label: 'Ujian Tulis' },
                            { id: 'qiyamullail', label: 'Qiyamullail' },
                            { id: 'monitoring', label: 'Monitoring' }
                        ].map((aspect) => (
                            <div key={aspect.id} className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{aspect.label}</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={settings.scoring_weight[aspect.id as keyof typeof settings.scoring_weight]}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            scoring_weight: {
                                                ...settings.scoring_weight,
                                                [aspect.id]: parseInt(e.target.value) || 0
                                            }
                                        })}
                                        className="w-full bg-slate-50 border-2 border-slate-100 focus:border-emerald-400 outline-none rounded-2xl px-5 py-4 font-black text-slate-700 transition-all text-center text-xl"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 font-black text-slate-300">%</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-slate-50 rounded-2xl flex items-center justify-between border-2 border-slate-100">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Total Persentase</span>
                        <div className={cn(
                            "px-4 py-2 rounded-xl font-black text-lg shadow-sm border-2",
                            (settings.scoring_weight.hafalan + settings.scoring_weight.ujianTulis + settings.scoring_weight.qiyamullail + settings.scoring_weight.monitoring) === 100
                                ? "bg-emerald-500 text-white border-emerald-400"
                                : "bg-rose-500 text-white border-rose-400"
                        )}>
                            {settings.scoring_weight.hafalan + settings.scoring_weight.ujianTulis + settings.scoring_weight.qiyamullail + settings.scoring_weight.monitoring}%
                        </div>
                    </div>
                </div>

                {/* Streak Bonus Card */}
                <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-sm overflow-hidden p-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-14 w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                            <Flame className="h-8 w-8 text-orange-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900">Mekanisme Poin Streak</h3>
                            <p className="text-slate-400 font-bold text-sm tracking-tight">Bonus Poin tambahan saat santri rutin lapor secara berturut-turut.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {[...settings.streak_config].sort((a, b) => a.days - b.days).map((rule, idx) => (
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
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Bonus Poin</label>
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
                </div>
            </div>

            {/* Status Info */}
            <div className="bg-primary/5 p-8 rounded-[2.5rem] border-2 border-primary/10 flex gap-6 items-start">
                <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                    <Info className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                    <h4 className="font-black text-slate-900 uppercase tracking-wider text-xs">Penting untuk Diperhatikan</h4>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">
                        Perubahan pada <span className="text-primary font-bold">Jadwal Pelaksanaan</span> akan langsung berdampak pada tampilan misi di halaman santri.
                        Sedangkan <span className="text-orange-500 font-bold">Bonus Poin Streak</span> hanya akan diaplikasikan jika Admin menekan tombol
                        <span className="text-slate-900 font-black"> "Sync Leaderboard"</span> di halaman Rekap Nilai.
                    </p>
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
