"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogIn, Loader2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import Mascot from "@/components/gamification/Mascot";

interface Participant {
    nama: string;
    kelompok: string;
    role: string;
}

function LoginForm() {
    const router = useRouter();
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [selectedNama, setSelectedNama] = useState("");
    const [selectedKelompok, setSelectedKelompok] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [isMentorMode, setIsMentorMode] = useState(false);
    const [isParentMode, setIsParentMode] = useState(false);
    const [password, setPassword] = useState("");

    const [loginStep, setLoginStep] = useState<"choice" | "pin" | "setup">("choice");
    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");

    useEffect(() => {
        fetch("/api/sheets/participants")
            .then(r => r.json())
            .then(data => {
                setParticipants(data.participants || []);
            })
            .catch(() => setError("Gagal memuat daftar peserta. Coba muat ulang."))
            .finally(() => setLoadingData(false));
    }, []);

    // Unique kelompok options
    const kelompokOptions = [...new Set(participants.map(p => p.kelompok))].sort();

    // Nama options filtered by kelompok (or all if Parent Mode)
    const namaOptions = participants
        .filter(p => isParentMode || !selectedKelompok || p.kelompok === selectedKelompok)
        .filter(p => p.role === "santri") // Only santri in standard list
        .map(p => p.nama)
        .sort();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        let loginKelompok = selectedKelompok;

        // If Parent Mode, find the kelompok of the selected student
        if (isParentMode) {
            const student = participants.find(p => p.nama === selectedNama);
            if (!student) {
                setError("Data Ananda tidak ditemukan.");
                return;
            }
            loginKelompok = student.kelompok;
        }

        if (!isParentMode && !loginKelompok) {
            setError("Pilih Kelompok terlebih dahulu.");
            return;
        }

        if (!selectedNama && !isMentorMode) {
            setError("Pilih Nama kamu.");
            return;
        }

        if (isMentorMode && !password) {
            setError("Masukkan password mentor.");
            return;
        }

        if (loginStep === "setup" && pin !== confirmPin) {
            setError("Konfirmasi PIN tidak cocok.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/sheets-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nama: isMentorMode ? "" : selectedNama,
                    kelompok: loginKelompok,
                    password: isMentorMode ? password : "",
                    role: isParentMode ? 'parent' : (isMentorMode ? 'mentor' : 'santri'),
                    pin: loginStep === "pin" ? pin : "",
                    newPin: loginStep === "setup" ? pin : ""
                }),
            });

            // Check if response is JSON
            const contentType = res.headers.get("content-type");
            let data;
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                const text = await res.text();
                throw new Error(text.slice(0, 100) || res.statusText);
            }

            if (!res.ok) {
                if (data.error === "PIN_REQUIRED") {
                    setLoginStep("pin");
                } else if (data.error === "SETUP_PIN_REQUIRED") {
                    setLoginStep("setup");
                } else {
                    setError(data.message || data.error || `HTTP Error ${res.status}`);
                }
                return;
            }

            const role = data.user?.role || "santri";
            if (role === "mentor") router.push("/mentor");
            else if (role === "admin") router.push("/admin");
            else if (role === "parent") router.push("/habits");
            else router.push("/map");

        } catch (err: any) {
            console.error("Login Error:", err);
            setError(`Kesalahan Jaringan: ${err.message || "Gagal menghubungi server"}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleLogin}
            className="space-y-4"
        >
            {loginStep === "choice" && (
                <div className="flex bg-slate-100 p-1 rounded-2xl mb-4">
                    <button
                        type="button"
                        onClick={() => { setIsMentorMode(false); setIsParentMode(false); setError(""); }}
                        className={cn(
                            "flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            (!isMentorMode && !isParentMode) ? "bg-white shadow-sm text-primary" : "text-slate-400"
                        )}
                    >
                        Santri
                    </button>
                    <button
                        type="button"
                        onClick={() => { setIsMentorMode(true); setIsParentMode(false); setError(""); }}
                        className={cn(
                            "flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            isMentorMode ? "bg-white shadow-sm text-primary" : "text-slate-400"
                        )}
                    >
                        Mentor
                    </button>
                    <button
                        type="button"
                        onClick={() => { setIsParentMode(true); setIsMentorMode(false); setError(""); }}
                        className={cn(
                            "flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            isParentMode ? "bg-white shadow-sm text-primary" : "text-slate-400"
                        )}
                    >
                        Wali
                    </button>
                </div>
            )}

            {loadingData ? (
                <div className="flex flex-col items-center gap-3 py-8 text-slate-400">
                    <Loader2 className="h-7 w-7 animate-spin text-primary" />
                    <p className="text-sm font-medium">Memuat data...</p>
                </div>
            ) : (
                <>
                    {loginStep === "choice" && (
                        <>
                            {/* Kelompok Dropdown */}
                            {!isParentMode && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Kelompok
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedKelompok}
                                            onChange={e => {
                                                setSelectedKelompok(e.target.value);
                                                setSelectedNama("");
                                            }}
                                            className="w-full appearance-none p-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none text-slate-700 font-bold transition-all text-sm bg-white"
                                            required
                                        >
                                            <option value="">— Pilih Kelompok —</option>
                                            {kelompokOptions.map(k => (
                                                <option key={k} value={k}>{k}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    </div>
                                </div>
                            )}

                            {!isMentorMode ? (
                                /* Nama Dropdown (Santri Mode) */
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Nama Santri
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedNama}
                                            onChange={e => setSelectedNama(e.target.value)}
                                            className="w-full appearance-none p-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none text-slate-700 font-bold transition-all text-sm bg-white disabled:opacity-50"
                                            disabled={!isParentMode && !selectedKelompok}
                                            required
                                        >
                                            <option value="">{isParentMode ? "— Pilih Nama Ananda —" : "— Pilih Nama —"}</option>
                                            {namaOptions.map(n => (
                                                <option key={n} value={n}>{n}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    </div>
                                </div>
                            ) : (
                                /* Password Input (Mentor Mode) */
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Password Mentor
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Masukkan password..."
                                        className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none text-slate-700 font-bold transition-all text-sm bg-white"
                                        required
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {loginStep === "pin" && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="text-center bg-primary/5 p-4 rounded-2xl border border-primary/10 mb-2">
                                <p className="text-xs font-bold text-slate-600">Halo, <span className="text-primary">{selectedNama}</span>!</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Masukkan PIN 4-angka kamu</p>
                            </div>
                            <div className="space-y-1.5 text-center">
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    maxLength={4}
                                    value={pin}
                                    onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
                                    placeholder="••••"
                                    className="w-full text-center text-4xl tracking-[2rem] p-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none text-slate-700 font-black transition-all bg-white"
                                    autoFocus
                                    required
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => { setLoginStep("choice"); setPin(""); setError(""); }}
                                className="text-[10px] font-black text-slate-400 block mx-auto uppercase tracking-widest hover:text-primary transition-colors"
                            >
                                Bukan kamu? Ganti Nama
                            </button>
                        </div>
                    )}

                    {loginStep === "setup" && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="text-center bg-amber-50 p-4 rounded-2xl border border-amber-100 mb-2">
                                <p className="text-xs font-bold text-amber-700">Akun baru atau PIN belum diset.</p>
                                <p className="text-[10px] text-amber-600 uppercase tracking-widest mt-1">Buat PIN 4-angka untuk keamanan</p>
                            </div>
                            <div className="space-y-1.5 italic">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">
                                    Pilih PIN Baru
                                </label>
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    maxLength={4}
                                    value={pin}
                                    onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
                                    placeholder="••••"
                                    className="w-full text-center text-4xl tracking-[2rem] p-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none text-slate-700 font-black transition-all bg-white"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">
                                    Konfirmasi PIN
                                </label>
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    maxLength={4}
                                    value={confirmPin}
                                    onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                                    placeholder="••••"
                                    className="w-full text-center text-4xl tracking-[2rem] p-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none text-slate-700 font-black transition-all bg-white"
                                    required
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => { setLoginStep("choice"); setPin(""); setConfirmPin(""); setError(""); }}
                                className="text-[10px] font-black text-slate-400 block mx-auto uppercase tracking-widest hover:text-primary transition-colors"
                            >
                                Kembali ke Pilihan Nama
                            </button>
                        </div>
                    )}
                </>
            )}

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[11px] font-bold text-center"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                type="submit"
                disabled={isLoading || loadingData || (!isParentMode && !selectedKelompok) || (!isMentorMode && !selectedNama)}
                className="w-full py-4.5 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black text-base transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
                {isLoading ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> MEMPROSES...</>
                ) : (
                    <><LogIn className="h-5 w-5" /> MASUK</>
                )}
            </button>
        </motion.form>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-5 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
            >
                {/* Header */}
                <div className="bg-primary/5 p-6 flex flex-col items-center border-b border-slate-50">
                    <Mascot pose="success" className="mb-3 scale-90" />
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">SATU SAF</h1>
                    <p className="text-slate-500 font-medium text-sm">Monitoring 14 Hari Pesantren Kilat</p>
                </div>

                <div className="p-6 space-y-5">
                    <div className="text-center space-y-1">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                            <Users className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Pilih Identitasmu</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Selamat Datang!</h2>
                        <p className="text-slate-400 text-xs">Pilih kelompok dan nama kamu untuk masuk</p>
                    </div>

                    <Suspense fallback={<div className="h-40 animate-pulse bg-slate-50 rounded-2xl" />}>
                        <LoginForm />
                    </Suspense>
                </div>
            </motion.div>

            <p className="mt-6 text-center text-[10px] text-slate-400">
                Masalah login? Hubungi panitia atau admin.
            </p>

            {/* Decorative Mascots */}
            <div className="fixed bottom-10 left-10 opacity-10 hidden lg:block pointer-events-none">
                <Mascot pose="thinking" className="scale-150 rotate-12" />
            </div>
            <div className="fixed top-20 right-20 opacity-10 hidden lg:block pointer-events-none">
                <Mascot pose="cheer" className="scale-125 -rotate-12" />
            </div>
        </div>
    );
}
