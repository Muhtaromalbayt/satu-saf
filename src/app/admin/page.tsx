"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Users, CheckCircle, Clock, Download, LogIn, LayoutDashboard, BarChart3 } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

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
        { label: "Udah Login", value: statsData?.studentsLoggedIn || "0", icon: LogIn, color: "text-indigo-600", bg: "bg-indigo-50" },
        { label: "Mengerjakan Tugas", value: statsData?.overallActivity || "0", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Rata-rata Upload", value: statsData?.averageUploads || "0", icon: BarChart3, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    const handleExportPDF = () => {
        if (!statsData) return;

        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(22);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text("Laporan Aktivitas Santri", 14, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Sistem: SATU SAF Control Center`, 14, 28);
        doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 34);
        
        // Summary Cards Section
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.text("Ringkasan Statistik", 14, 48);
        
        const summaryData = [
            ["Total Santri", statsData.totalSantri],
            ["Sudah Login", statsData.studentsLoggedIn],
            ["Aktif Mengerjakan", statsData.overallActivity],
            ["Rata-rata Upload", statsData.averageUploads],
            ["Pending Approval", statsData.pendingApprovals],
            ["Materi Aktif", statsData.totalLessons]
        ];
        
        (doc as any).autoTable({
            body: summaryData,
            startY: 54,
            theme: 'plain',
            styles: { fontSize: 11, cellPadding: 4 },
            columnStyles: { 0: { fontStyle: 'bold', width: 50 }, 1: { halign: 'right' } }
        });
        
        // Daily Activity Section
        if (statsData.dailyActivity && statsData.dailyActivity.length > 0) {
            doc.setFontSize(14);
            doc.text("Partisipasi Harian (14 Hari)", 14, (doc as any).lastAutoTable.finalY + 15);
            
            const dailyData = statsData.dailyActivity
                .sort((a: any, b: any) => a.day - b.day)
                .map((da: any) => [`Hari ke-${da.day}`, `${da.count} Santri`]);
                
            (doc as any).autoTable({
                head: [["Periode", "Jumlah Partisipasi"]],
                body: dailyData,
                startY: (doc as any).lastAutoTable.finalY + 20,
                theme: 'striped',
                headStyles: { fillColor: [79, 70, 229] }
            });
        }
        
        doc.save(`laporan_admin_${new Date().toISOString().split('T')[0]}.pdf`);
    };

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
                <div className="flex flex-col items-end gap-4">
                    <Button 
                        onClick={handleExportPDF}
                        variant="outline"
                        className="rounded-2xl font-black border-2 border-slate-100 hover:bg-slate-50 h-12 px-6"
                    >
                        <Download className="mr-2 h-5 w-5" /> Export PDF Report
                    </Button>
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

// Utility components
function Button({ className, variant, ...props }: any) {
    const variants: any = {
        outline: "border-2 border-slate-100 bg-white hover:bg-slate-50 text-slate-900",
        ghost: "hover:bg-slate-100 text-slate-600",
        primary: "bg-primary text-white hover:bg-primary/90"
    };
    return (
        <button 
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                variants[variant || "primary"],
                className
            )} 
            {...props} 
        />
    );
}

// Utility function duplicated here for simplicity since @/lib/utils/cn might be expected
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
