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
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative overflow-hidden">
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[40] md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={cn(
                "fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 z-[50] transition-transform duration-300 ease-in-out shrink-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                            <ShieldAlert className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-white font-black text-lg leading-none">SATU SAF</h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Admin Panel</p>
                        </div>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors font-bold text-sm"
                            >
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={signOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-bold text-sm"
                    >
                        <LogOut className="h-5 w-5" />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-[30]">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 md:hidden hover:bg-slate-100"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h2 className="text-slate-800 font-black text-lg truncate max-w-[150px] sm:max-w-none">Control Center</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-slate-800">{user?.name || "Admin"}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{user?.role || "Admin"}</p>
                        </div>
                        <div className="h-10 w-10 bg-slate-100 rounded-full border-2 border-slate-50 flex items-center justify-center font-black text-primary">
                            {(user?.name || "A").charAt(0)}
                        </div>
                    </div>
                </header>
                <div className="p-4 md:p-8 pb-20 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
