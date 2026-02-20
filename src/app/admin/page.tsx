"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">Dashboard</h1>
                    <p className="text-slate-500 font-medium">Selamat datang kembali di panel administrasi SATU SAF.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm"
                        >
                            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-4", stat.bg)}>
                                <Icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-black text-slate-800">
                                    {loading ? "..." : stat.value}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity Placeholder */}
                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
                    <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" /> Aktivitas Terbaru
                    </h3>
                    <div className="space-y-4 text-center py-10">
                        <p className="text-slate-400 font-bold italic text-sm">Belum ada aktivitas terbaru hari ini.</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
                    <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                        Pintasan Cepat
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button className="p-4 rounded-2xl border-2 border-slate-50 hover:border-primary hover:bg-primary/5 transition-all text-left group">
                            <p className="font-bold text-slate-800">Buat Materi Baru</p>
                            <p className="text-xs text-slate-400 group-hover:text-primary transition-colors">Tambah chapter atau quiz baru</p>
                        </button>
                        <button className="p-4 rounded-2xl border-2 border-slate-50 hover:border-primary hover:bg-primary/5 transition-all text-left group">
                            <p className="font-bold text-slate-800">Daftar Santri</p>
                            <p className="text-xs text-slate-400 group-hover:text-primary transition-colors">Lihat progres database santri</p>
                        </button>
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
