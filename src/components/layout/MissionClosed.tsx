"use client";

import { Lock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthProvider";

export default function MissionClosed() {
    const { signOut } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-slate-100 text-center space-y-6">
                <div className="h-20 w-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto border-2 border-rose-100">
                    <Lock className="h-10 w-10 text-rose-500" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Akses Ditutup</h1>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                        Maaf, akses pengerjaan misi sementara ditutup oleh Admin. <br />
                        Silakan hubungi pembimbing atau panitia untuk informasi lebih lanjut.
                    </p>
                </div>

                <div className="pt-4">
                    <Button
                        onClick={() => signOut()}
                        variant="ghost"
                        className="text-slate-400 font-bold hover:text-rose-500 transition-colors gap-2"
                    >
                        <LogOut className="h-4 w-4" /> Keluar dari Akun
                    </Button>
                </div>

                <div className="pt-6 border-t border-slate-50">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">SATU SAF - Masjid Nurul Falah</p>
                </div>
            </div>
        </div>
    );
}
