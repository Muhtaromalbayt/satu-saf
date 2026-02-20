"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, BookOpen, Users, LogOut, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

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
        { href: "/admin/lessons", label: "Materi & Quiz", icon: BookOpen },
        { href: "/admin/users", label: "Santri & Mentor", icon: Users },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                        <ShieldAlert className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-white font-black text-lg leading-none">SATU SAF</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Admin Panel</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
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
            <main className="flex-1 overflow-x-hidden">
                <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8">
                    <h2 className="text-slate-800 font-black text-lg">Control Center</h2>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-slate-800">{user.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{user.role}</p>
                        </div>
                        <div className="h-10 w-10 bg-slate-100 rounded-full border-2 border-slate-50 flex items-center justify-center font-black text-primary">
                            {user.name.charAt(0)}
                        </div>
                    </div>
                </header>
                <div className="p-8 pb-20">
                    {children}
                </div>
            </main>
        </div>
    );
}
