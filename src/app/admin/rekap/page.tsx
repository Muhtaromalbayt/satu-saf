"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Download,
    Upload,
    Edit2,
    Save,
    X,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Trophy,
    Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface SantriScore {
    id: string;
    name: string;
    kelompok: string;
    hafalan: number;
    ujianTulis: number;
    qiyamullail: number;
    monitoring: number;
    total: number;
}

export default function RekapNilaiPage() {
    const [data, setData] = useState<SantriScore[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<Partial<SantriScore>>({});
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/rekap");
            const data = await res.json();
            if (res.ok) {
                setData(data);
            } else {
                setToast({
                    type: 'error',
                    message: data.message ? `${data.error}: ${data.message}` : (data.error || "Gagal memuat data.")
                });
            }
        } catch (err) {
            console.error("Fetch rekap error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (santri: SantriScore) => {
        setEditingId(santri.id);
        setEditValues({
            hafalan: santri.hafalan,
            ujianTulis: santri.ujianTulis,
            qiyamullail: santri.qiyamullail
        });
    };

    const handleSave = async (id: string) => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/rekap", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: id,
                    ...editValues
                })
            });

            if (res.ok) {
                setToast({ type: 'success', message: "Nilai berhasil diperbarui!" });
                setEditingId(null);
                fetchData();
            } else {
                setToast({ type: 'error', message: "Gagal memperbarui nilai." });
            }
        } catch (err) {
            setToast({ type: 'error', message: "Terjadi kesalahan jaringan." });
        } finally {
            setSaving(false);
            setTimeout(() => setToast(null), 3000);
        }
    };

    const filteredData = data.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.kelompok.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Rekap Nilai Santri</h1>
                    <p className="text-slate-500 font-medium">Pantau dan kelola nilai akhir dari semua aspek penilaian.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/import">
                        <Button variant="outline" className="rounded-2xl font-black border-2 border-slate-100 hover:bg-slate-50 h-12 px-6">
                            <Upload className="mr-2 h-5 w-5" /> Import CSV
                        </Button>
                    </Link>
                    <Button
                        onClick={async () => {
                            if (!confirm("Sinkronkan semua nilai ini ke Leaderboard?")) return;
                            setSaving(true);
                            try {
                                const res = await fetch("/api/admin/rekap/sync", { method: "POST" });
                                if (res.ok) {
                                    setToast({ type: 'success', message: "Leaderboard berhasil disinkronkan!" });
                                } else {
                                    setToast({ type: 'error', message: "Gagal sinkronisasi leaderboard." });
                                }
                            } catch (err) {
                                setToast({ type: 'error', message: "Kesalahan jaringan." });
                            } finally {
                                setSaving(false);
                                setTimeout(() => setToast(null), 3000);
                            }
                        }}
                        disabled={saving}
                        className="rounded-2xl font-black bg-slate-900 text-white hover:bg-slate-800 h-12 px-6 shadow-xl shadow-slate-900/10 active:scale-95 transition-all"
                    >
                        {saving ? <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> : <Trophy className="mr-2 h-5 w-5 text-amber-400" />}
                        Sync Leaderboard
                    </Button>
                    <Button
                        onClick={fetchData}
                        variant="outline"
                        disabled={loading}
                        className="h-12 w-12 rounded-2xl p-0 flex items-center justify-center border-2 border-slate-100 bg-white hover:bg-slate-50"
                    >
                        <RefreshCw className={cn("h-5 w-5 text-slate-400", loading && "animate-spin")} />
                    </Button>
                </div>
            </header>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-3xl border-2 border-slate-100 shadow-sm flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari nama santri atau kelompok..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-600 transition-all"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b-2 border-slate-100">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Santri</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Kelompok</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Hafalan</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Ujian Tulis</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Qiyamullail</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Monitoring</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Total</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-slate-50">
                            <AnimatePresence mode="popLayout">
                                {filteredData.map((santri, idx) => {
                                    const isEditing = editingId === santri.id;

                                    return (
                                        <motion.tr
                                            key={santri.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className={cn(
                                                "hover:bg-slate-50/50 transition-colors group",
                                                isEditing && "bg-blue-50/30"
                                            )}
                                        >
                                            <td className="px-8 py-5">
                                                <p className="font-black text-slate-800 text-sm">{santri.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">ID: {santri.id.slice(0, 8)}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase">
                                                    {santri.kelompok}
                                                </span>
                                            </td>

                                            {/* Score Columns */}
                                            {['hafalan', 'ujianTulis', 'qiyamullail'].map((key) => (
                                                <td key={key} className="px-6 py-5 text-center">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            value={(editValues as any)[key]}
                                                            onChange={(e) => setEditValues({ ...editValues, [key]: parseFloat(e.target.value) || 0 })}
                                                            className="w-20 px-2 py-1.5 bg-white border-2 border-blue-200 rounded-xl text-center font-black text-sm text-blue-600 outline-none"
                                                        />
                                                    ) : (
                                                        <span className="font-black text-slate-600 text-sm">{(santri as any)[key]}</span>
                                                    )}
                                                </td>
                                            ))}

                                            <td className="px-6 py-5 text-center">
                                                <div className="inline-flex flex-col items-center">
                                                    <span className="font-black text-emerald-600 text-sm">{santri.monitoring}%</span>
                                                    <div className="w-12 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                                        <div
                                                            className="h-full bg-emerald-500 rounded-full"
                                                            style={{ width: `${Math.min(santri.monitoring, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5 text-center">
                                                <span className="px-4 py-2 bg-primary/10 rounded-2xl font-black text-primary text-base border-2 border-primary/5">
                                                    {santri.total % 1 === 0 ? santri.total : santri.total.toFixed(2)}
                                                </span>
                                            </td>

                                            <td className="px-8 py-5 text-right">
                                                {isEditing ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            onClick={() => handleSave(santri.id)}
                                                            disabled={saving}
                                                            size="sm"
                                                            className="h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                                                        >
                                                            {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} Simpan
                                                        </Button>
                                                        <Button
                                                            onClick={() => setEditingId(null)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-10 w-10 p-0 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                                                        >
                                                            <X className="h-5 w-5" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        onClick={() => handleEdit(santri)}
                                                        variant="outline"
                                                        className="h-10 px-4 rounded-xl bg-slate-50 hover:bg-primary/5 hover:text-primary transition-all font-black text-[11px] uppercase tracking-widest text-slate-400 border-2 border-transparent group-hover:border-primary/10"
                                                    >
                                                        <Edit2 className="h-4 w-4 mr-2" /> Edit
                                                    </Button>
                                                )}
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                    {filteredData.length === 0 && !loading && (
                        <div className="p-20 text-center">
                            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                                <Search className="h-10 w-10 text-slate-200" />
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Tidak ada data santri ditemukan.</p>
                        </div>
                    )}
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
