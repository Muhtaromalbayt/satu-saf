"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, BookOpen, HeartHandshake, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Mascot from "@/components/gamification/Mascot";

export default function RegisterRolePage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-5 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 space-y-6"
            >
                <div className="flex flex-col items-center text-center space-y-3">
                    <Mascot pose="cheer" className="w-20 h-20" />
                    <div className="space-y-1.5">
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">GABUNG SATU SAF</h1>
                        <p className="text-slate-500 font-medium italic text-sm">Pilih peranmu untuk memulai petualangan!</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <Link href="/login?role=student&mode=register" className="block">
                        <Button
                            variant="default"
                            size="lg"
                            className="w-full text-base h-16 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all bg-primary flex flex-col items-center justify-center gap-0.5 group"
                        >
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5 group-hover:animate-bounce" />
                                <span className="font-black tracking-wider text-lg uppercase">SANTRI</span>
                            </div>
                            <span className="text-[9px] opacity-70 font-bold uppercase tracking-widest">Belajar & Bermain</span>
                        </Button>
                    </Link>

                    <Link href="/login?role=mentor&mode=register" className="block">
                        <Button
                            variant="secondary"
                            size="lg"
                            className="w-full text-base h-16 rounded-2xl bg-slate-800 text-white hover:bg-slate-900 border-b-4 border-slate-950 shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5 group"
                        >
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                                <span className="font-black tracking-wider text-lg uppercase">MENTOR</span>
                            </div>
                            <span className="text-[9px] opacity-70 font-bold uppercase tracking-widest">Membimbing & Menilai</span>
                        </Button>
                    </Link>

                    <Link href="/login?role=parent&mode=register" className="block">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full text-base h-16 rounded-2xl border-2 border-slate-200 hover:bg-slate-50 hover:border-primary/50 shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5 group"
                        >
                            <div className="flex items-center gap-2">
                                <HeartHandshake className="h-5 w-5 text-red-500 group-hover:scale-110 transition-transform" />
                                <span className="font-black tracking-wider text-lg uppercase text-slate-800">ORANG TUA</span>
                            </div>
                            <span className="text-[9px] opacity-70 font-bold uppercase tracking-widest text-slate-500">Memantau Progres Anak</span>
                        </Button>
                    </Link>
                </div>

                <div className="pt-3 flex justify-center">
                    <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors">
                        <ArrowLeft className="h-4 w-4" /> KEMBALI KE BERANDA
                    </Link>
                </div>
            </motion.div>

            <p className="mt-6 text-center text-[10px] text-slate-400">
                Pendaftaran Terbuka Sepanjang Ramadhan 1447 H.
            </p>
        </div>
    );
}
