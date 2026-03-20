"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Users, CheckCircle, Clock } from "lucide-react";

export default function AdminDashboard() {
    const [statsData, setStatsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/stats")
            .then(res => res.json())
            .then(data => {
                setStatsData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch stats error:", err);
                setLoading(false);
            });
    }, []);

    const stats = [
        { label: "Total Santri", value: statsData?.totalSantri || "0", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Materi Aktif", value: statsData?.totalLessons || "0", icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Pending Approval", value: statsData?.pendingApprovals || "0", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Check-in Hari Ini", value: statsData?.checkinsToday || "0", icon: CheckCircle, color: "text-purple-600", bg: "bg-purple-50" },
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">Dashboard</h1>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-lg">
                        Selamat datang kembali di <span className="text-primary font-black">Control Center</span> SATU SAF. Pantau progres santri dan amalan harian di sini.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="h-14 w-1 bg-primary/20 rounded-full hidden md:block" />
                    <div className="text-right hidden md:block">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Sistem</p>
                        <p className="text-emerald-500 font-black text-xs flex items-center gap-1.5 justify-end">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> TERHUBUNG
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
                        >
                            <div className={cn("h-16 w-16 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500", stat.bg)}>
                                <Icon className={cn("h-8 w-8", stat.color)} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-black text-slate-900 tracking-tight">
                                    {loading ? "..." : stat.value}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-primary" />
                            </div>
                            Aktivitas Terbaru
                        </h3>
                        <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Lihat Semua</button>
                    </div>
                    <div className="space-y-6 text-center py-20 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
                        <div className="h-20 w-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                            <CheckCircle className="h-10 w-10 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-bold italic text-sm">Belum ada aktivitas terbaru yang terdeteksi.</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 h-40 w-40 bg-primary/20 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-primary/30 transition-colors" />

                    <h3 className="text-xl font-black mb-8 relative z-10">Pintasan Cepat</h3>

                    <div className="space-y-4 relative z-10">
                        <Link
                            href="/admin/tasks"
                            className="block p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-left group/btn active:scale-95"
                        >
                            <p className="font-black text-white text-lg leading-tight mb-1">Manajemen Tugas</p>
                            <p className="text-xs text-slate-500 group-hover/btn:text-slate-400 transition-colors">Atur amalan harian tiap aspek</p>
                        </Link>

                        <Link
                            href="/admin/users"
                            className="block p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-left group/btn active:scale-95"
                        >
                            <p className="font-black text-white text-lg leading-tight mb-1">Daftar Santri</p>
                            <p className="text-xs text-slate-500 group-hover/btn:text-slate-400 transition-colors">Lihat database dan progres santri</p>
                        </Link>

                        <Link
                            href="/admin/rekap"
                            className="block p-6 rounded-3xl bg-primary hover:bg-primary-hover transition-all text-center group/btn shadow-xl shadow-primary/20 active:scale-95 mt-6"
                        >
                            <p className="font-black text-white uppercase tracking-widest text-[10px]">Buka Rekap Nilai</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Utility function duplicated here for simplicity since @/lib/utils/cn might be expected
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
