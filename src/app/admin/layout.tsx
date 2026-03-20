"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, BookOpen, Users, LogOut, ShieldAlert, Menu, X as CloseIcon, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'admin') {
                router.push("/");
            } else {
                setIsAuthorized(true);
            }
        }
    }, [user, loading, router]);

    if (loading || !isAuthorized) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="text-center space-y-4">
                    <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">Memverifikasi Admin...</p>
                </div>
            </div>
        );
    }

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/rekap", label: "Rekap Nilai", icon: BookOpen },
        { href: "/admin/tasks", label: "Manajemen Tugas", icon: LayoutGrid },
        { href: "/admin/users", label: "Santri & Mentor", icon: Users },
        { href: "/admin/import", label: "Import Nilai", icon: ShieldAlert },
        { href: "/admin/settings", label: "Pengaturan", icon: ShieldAlert },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden font-sans">
            {/* Overlay Drawer */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Drawer */}
            <aside className={cn(
                "fixed top-0 left-0 h-screen w-72 bg-slate-900 text-slate-300 flex flex-col border-r-4 border-slate-800 z-[110] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) shadow-2xl",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <ShieldAlert className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-white font-black text-xl leading-none tracking-tighter">SATU SAF</h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5 opacity-60">Admin Systems</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-slate-500 transition-colors"
                    >
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex-1 p-6 space-y-3 overflow-y-auto scrollbar-hide">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className="group flex items-center gap-4 px-5 py-4 rounded-[1.5rem] hover:bg-white/5 hover:text-white transition-all duration-300 font-bold text-sm relative overflow-hidden"
                            >
                                <div className="h-2 w-1 bg-primary absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full scale-0 group-hover:scale-100 transition-transform" />
                                <Icon className="h-5 w-5 text-slate-500 group-hover:text-primary transition-colors" />
                                <span className="tracking-tight">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-white/5">
                    <button
                        onClick={signOut}
                        className="w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all font-black text-xs uppercase tracking-widest"
                    >
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-500/10 shrink-0">
                            <LogOut className="h-5 w-5" />
                        </div>
                        <span>Keluar Panel</span>
                    </button>
                </div>
            </aside>

            {/* Header Content */}
            <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 md:px-10 sticky top-0 z-[50]">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="h-12 w-12 flex items-center justify-center rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="hidden sm:block">
                        <h2 className="text-slate-900 font-black text-xl tracking-tight leading-none">Control Center</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5">Administrative Overview</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-1.5 pl-5 rounded-3xl border border-slate-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-slate-900 leading-none">{user?.name || "Admin"}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Administrator</p>
                    </div>
                    <div className="h-11 w-11 bg-white rounded-2xl border-2 border-white shadow-sm flex items-center justify-center font-black text-primary text-lg">
                        {(user?.name || "A").charAt(0)}
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden p-6 md:p-12">
                <div className="mx-auto max-w-7xl">
                    {children}
                </div>
            </main>

            {/* Footer / Badge */}
            <footer className="py-8 px-10 flex justify-center opacity-30">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    <ShieldAlert className="h-3 w-3" />
                    SATU SAF Management v2.4
                </div>
            </footer>
        </div>
    );
}
