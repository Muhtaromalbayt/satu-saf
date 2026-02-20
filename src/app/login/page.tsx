"use client";

import { motion } from "framer-motion";
import Mascot from "@/components/gamification/Mascot";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, ArrowLeft } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

function LoginForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const role = searchParams.get("role") || "santri";
    const mode = searchParams.get("mode");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isRegister, setIsRegister] = useState(mode === "register");

    const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            if (isRegister) {
                const name = formData.get("name") as string;
                // Add role to the sign-up payload
                const { error: signUpError } = await authClient.signUp.email({
                    email,
                    password,
                    name,
                    role: role, // Pass the role from the URL
                } as any);
                if (signUpError) {
                    console.error("Registration Error:", signUpError);
                    setError(signUpError.message || JSON.stringify(signUpError) || "Registrasi gagal");
                    setLoading(false);
                    return;
                }
            } else {
                const { error: signInError } = await authClient.signIn.email({
                    email,
                    password,
                });
                if (signInError) {
                    setError(signInError.message || "Login gagal");
                    setLoading(false);
                    return;
                }
            }

            // Redirect based on role
            if (role === 'mentor') {
                router.push("/mentor");
            } else if (role === 'parent') {
                router.push("/parent");
            } else if (role === 'admin') {
                router.push("/admin");
            } else {
                router.push("/map");
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan";
            setError(errorMessage);
            setLoading(false);
        }
    };

    const roleLabel = role === 'mentor' ? 'Mentor' : role === 'parent' ? 'Orang Tua' : role === 'admin' ? 'Administrator' : 'Santri';
    const roleColor = role === 'mentor'
        ? 'bg-slate-800 text-white'
        : role === 'admin'
            ? 'bg-red-600 text-white'
            : 'bg-blue-50 text-blue-600';

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
        >
            <div className="text-center">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${roleColor}`}>
                    {isRegister ? `Daftar` : `Masuk`} sebagai {roleLabel}
                </span>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
                {isRegister && (
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                        <input
                            name="name"
                            type="text"
                            placeholder="Nama kamu"
                            required
                            className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none text-slate-700 font-bold transition-all"
                        />
                    </div>
                )}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="nama@email.com"
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
                        minLength={8}
                        className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none text-slate-700 font-bold transition-all"
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium text-center break-words">
                        {error}
                        {/* DEBUGGING INFO */}
                        <div className="mt-2 text-xs text-left bg-white p-2 rounded border border-red-100 overflow-auto max-h-20">
                            Debug: {error}
                        </div>
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-7 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-bold text-lg transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                >
                    {isRegister ? (
                        <><UserPlus className="h-5 w-5" /> {loading ? "MEMPROSES..." : "DAFTAR AKUN"}</>
                    ) : (
                        <><LogIn className="h-5 w-5" /> {loading ? "MOHON TUNGGU..." : "MASUK"}</>
                    )}
                </Button>
            </form>

            <button
                onClick={() => { setIsRegister(!isRegister); setError(""); }}
                className="w-full text-center text-sm font-bold text-primary hover:underline"
            >
                {isRegister ? "Sudah punya akun? Masuk di sini" : "Belum punya akun? Daftar di sini"}
            </button>

            <Link href="/" className="flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors pt-2">
                <ArrowLeft className="h-4 w-4" /> UBAH PERAN
            </Link>

            <p className="text-center text-[11px] text-slate-400">
                Dengan mendaftar, kamu menyetujui <br />
                <span className="font-bold text-slate-500 cursor-pointer hover:underline">Ketentuan Layanan</span> dan <span className="font-bold text-slate-500 cursor-pointer hover:underline">Kebijakan Privasi</span> kami.
            </p>

            {!isRegister && role !== 'admin' && (
                <div className="pt-4 border-t border-slate-100 flex justify-center">
                    <Link href="/login?role=admin" className="text-[10px] font-bold text-slate-300 hover:text-slate-500 transition-colors uppercase tracking-widest">
                        Masuk sebagai Admin
                    </Link>
                </div>
            )}
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
                Masalah login? Hubungi Superadmin Tutorial.
            </p>

            {/* Decorative BG mascot */}
            <div className="fixed bottom-10 left-10 opacity-10 hidden lg:block pointer-events-none">
                <Mascot pose="thinking" className="scale-150 rotate-12" />
            </div>
            <div className="fixed top-20 right-20 opacity-10 hidden lg:block pointer-events-none">
                <Mascot pose="cheer" className="scale-125 -rotate-12" />
            </div>
        </div>
    );
}
