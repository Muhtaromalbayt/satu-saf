"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Mascot from "@/components/gamification/Mascot";
import { User, Users, GraduationCap, CheckCircle2 } from "lucide-react";

export default function ProfileRegistration() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        role: 'student',
        name: session?.user?.name || '',
        kelas: '',
        gender: 'Laki-laki'
    });

    const handleNextStep = () => setStep(step + 1);
    const handlePrevStep = () => setStep(step - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/user/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Update session state so middleware knows we are done
                await update({
                    isProfileComplete: true,
                    name: formData.name,
                    role: formData.role
                });
                router.push('/map');
            }
        } catch (error) {
            console.error("Profile update failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl p-8 sm:p-12 space-y-8 relative overflow-hidden"
            >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
                    <motion.div
                        className="h-full bg-primary"
                        animate={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-8"
                        >
                            <div className="text-center space-y-2">
                                <Mascot pose="thinking" className="scale-75 mb-2" />
                                <h1 className="text-3xl font-black text-slate-800">Siapa Kamu?</h1>
                                <p className="text-slate-500">Pilih role kamu untuk memulai pengalaman yang pas.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setFormData({ ...formData, role: 'student' })}
                                    className={`p-6 rounded-3xl border-4 transition-all flex flex-col items-center gap-3 ${formData.role === 'student' ? 'border-primary bg-primary/5 shadow-lg' : 'border-slate-100 hover:border-slate-200'}`}
                                >
                                    <GraduationCap className={`h-12 w-12 ${formData.role === 'student' ? 'text-primary' : 'text-slate-400'}`} />
                                    <span className={`font-bold ${formData.role === 'student' ? 'text-slate-800' : 'text-slate-500'}`}>SANTRI</span>
                                </button>
                                <button
                                    onClick={() => setFormData({ ...formData, role: 'parent' })}
                                    className={`p-6 rounded-3xl border-4 transition-all flex flex-col items-center gap-3 ${formData.role === 'parent' ? 'border-primary bg-primary/5 shadow-lg' : 'border-slate-100 hover:border-slate-200'}`}
                                >
                                    <Users className={`h-12 w-12 ${formData.role === 'parent' ? 'text-primary' : 'text-slate-400'}`} />
                                    <span className={`font-bold ${formData.role === 'parent' ? 'text-slate-800' : 'text-slate-500'}`}>ORANG TUA</span>
                                </button>
                            </div>

                            <Button onClick={handleNextStep} className="w-full py-7 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-xl shadow-[0_4px_0_rgb(33,53,174)] active:translate-y-1 active:shadow-none">
                                LANJUT
                            </Button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-8"
                        >
                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-black text-slate-800">Lengkapi Profil</h1>
                                <p className="text-slate-500">Sedikit lagi! Masukkan data diri sederhana kamu.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                                        <User className="h-4 w-4" /> Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ketik namamu..."
                                        className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none text-slate-800 font-bold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4" /> Kelas
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.kelas}
                                        onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                                        placeholder="Contoh: 7-A / SD Kelas 4"
                                        className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none text-slate-800 font-bold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-700 uppercase tracking-widest">Jenis Kelamin</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Laki-laki', 'Perempuan'].map((g) => (
                                            <button
                                                key={g}
                                                onClick={() => setFormData({ ...formData, gender: g })}
                                                className={`p-4 rounded-2xl border-2 font-bold transition-all ${formData.gender === g ? 'border-primary bg-primary text-white shadow-md' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button onClick={handlePrevStep} variant="ghost" className="flex-1 py-7 text-slate-400 font-bold text-lg">KEMBALI</Button>
                                <Button onClick={handleNextStep} className="flex-[2] py-7 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-xl shadow-[0_4px_0_rgb(33,53,174)] active:translate-y-1 active:shadow-none">
                                    HAMPIR SELESAI
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center space-y-8"
                        >
                            <div className="flex flex-col items-center space-y-4">
                                <div className="h-24 w-24 bg-green-500 rounded-full flex items-center justify-center shadow-xl mb-4">
                                    <CheckCircle2 className="h-14 w-14 text-white" />
                                </div>
                                <h1 className="text-3xl font-black text-slate-800">Sempurna! ✨</h1>
                                <p className="text-slate-500">Profil kamu sudah siap. Mari bergabung bersama santri lainnya!</p>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-[2rem] text-left space-y-3 border-2 border-slate-100">
                                <p className="text-xs font-black text-slate-400 uppercase">Ringkasan Profil</p>
                                <p className="font-bold text-slate-700"><span className="text-slate-400">Nama:</span> {formData.name}</p>
                                <p className="font-bold text-slate-700"><span className="text-slate-400">Role:</span> {formData.role === 'student' ? 'SANTRI' : 'ORANG TUA'}</p>
                                <p className="font-bold text-slate-700"><span className="text-slate-400">Kelas:</span> {formData.kelas}</p>
                            </div>

                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full py-8 bg-green-500 hover:bg-green-600 text-white rounded-[2rem] font-bold text-2xl shadow-[0_6px_0_rgb(21,128,61)] active:translate-y-1 active:shadow-none transition-all"
                            >
                                {loading ? "MENYIMPAN..." : "MULAI BELAJAR!"}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
