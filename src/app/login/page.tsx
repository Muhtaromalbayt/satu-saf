"use client";

import { motion } from "framer-motion";
import Mascot from "@/components/gamification/Mascot";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { GraduationCap, Users, UserCog, ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

function LoginForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const role = searchParams.get("role");
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) {
            console.error("Login Error:", error.message);
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("Login Error:", error.message);
            setLoading(false);
            // Fallback for pre-seeded mentors if they aren't in Supabase yet? 
            // Better to show error.
            alert("Login gagal: " + error.message);
        } else {
            router.push("/mentor");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
        >
            {role === 'mentor' ? (
                <div className="space-y-6">
                    <div className="text-center">
                        <span className="px-3 py-1 bg-slate-800 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Akses Dashboard Mentor</span>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="nama@mentor.com"
                                required
                                className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none text-slate-700 font-bold transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none text-slate-700 font-bold transition-all"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full py-7 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-bold text-lg transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                        >
                            <LogIn className="h-5 w-5" /> {loading ? "MOHON TUNGGU..." : "MASUK KE DASHBOARD"}
                        </Button>
                    </form>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="text-center">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                            Masuk sebagai {role === 'parent' ? 'Orang Tua' : 'Santri'}
                        </span>
                    </div>

                    <Button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full py-7 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 rounded-2xl shadow-[0_4px_0_rgb(226,232,240)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-4 text-lg font-bold"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        {loading ? "Menghubungkan..." : "Lanjutkan dengan Google"}
                    </Button>
                </div>
            )}

            <Link href="/" className="flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors pt-2">
                <ArrowLeft className="h-4 w-4" /> UBAH PERAN
            </Link>

            <p className="text-center text-[11px] text-slate-400">
                Dengan mendaftar, kamu menyetujui <br />
                <span className="font-bold text-slate-500 cursor-pointer hover:underline">Ketentuan Layanan</span> dan <span className="font-bold text-slate-500 cursor-pointer hover:underline">Kebijakan Privasi</span> kami.
            </p>
        </motion.div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-2 border-slate-100"
            >
                {/* Header Decoration */}
                <div className="bg-primary/5 p-8 flex flex-col items-center border-b-2 border-slate-50">
                    <Mascot pose="success" className="mb-4" />
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">SATU SAF</h1>
                    <p className="text-slate-500 font-medium whitespace-nowrap">Platform Belajar PAI Masa Kini</p>
                </div>

                <div className="p-8 sm:p-10 space-y-6">
                    <div className="space-y-2 text-center">
                        <h2 className="text-2xl font-bold text-slate-800">Selamat Datang!</h2>
                    </div>

                    <Suspense fallback={<div className="h-60 animate-pulse bg-slate-50 rounded-2xl" />}>
                        <LoginForm />
                    </Suspense>
                </div>
            </motion.div>

            <p className="mt-8 text-center text-[10px] text-slate-400">
                Masalah login? Hubungi Superadmim Tutorial.
            </p>

            {/* Decorative BG mascot bits or text */}
            <div className="fixed bottom-10 left-10 opacity-10 hidden lg:block pointer-events-none">
                <Mascot pose="thinking" className="scale-150 rotate-12" />
            </div>
            <div className="fixed top-20 right-20 opacity-10 hidden lg:block pointer-events-none">
                <Mascot pose="cheer" className="scale-125 -rotate-12" />
            </div>
        </div>
    );
}
