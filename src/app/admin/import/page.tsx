"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function AdminImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setResult(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/admin/import", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setResult({ success: true, message: data.message, details: data.details });
            } else {
                setResult({ success: false, message: data.error || "Gagal mengimpor data." });
            }
        } catch (err) {
            setResult({ success: false, message: "Terjadi kesalahan jaringan." });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <Link href="/admin" className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm font-bold mb-4 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
                </Link>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Import Nilai (CSV)</h1>
                <p className="text-slate-500 font-medium mt-2">Unggah file CSV untuk memperbarui nilai santri secara massal.</p>
            </header>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-slate-100 space-y-8">
                <div
                    className={cn(
                        "border-4 border-dashed rounded-[2rem] p-12 text-center transition-all",
                        file ? "border-emerald-100 bg-emerald-50/30" : "border-slate-100 bg-slate-50/50 hover:border-primary/20 hover:bg-primary/5"
                    )}
                >
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                        id="csv-upload"
                    />
                    <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center gap-4">
                        <div className={cn(
                            "h-20 w-20 rounded-3xl flex items-center justify-center transition-all shadow-lg",
                            file ? "bg-emerald-500 text-white" : "bg-white text-slate-400"
                        )}>
                            {file ? <FileText className="h-10 w-10" /> : <Upload className="h-10 w-10" />}
                        </div>
                        <div>
                            <p className="text-lg font-black text-slate-800">
                                {file ? file.name : "Pilih File CSV"}
                            </p>
                            <p className="text-sm text-slate-400 font-medium">
                                {file ? `${(file.size / 1024).toFixed(2)} KB` : "Klik untuk mencari file (.csv)"}
                            </p>
                        </div>
                    </label>
                </div>

                <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100 flex gap-4">
                    <AlertCircle className="h-6 w-6 text-blue-500 shrink-0" />
                    <div className="text-sm text-blue-800/80 font-medium leading-relaxed">
                        <p className="font-black text-blue-900 uppercase tracking-widest text-[10px] mb-1">Format Kolom CSV:</p>
                        <code className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-700 font-bold">Nama, Kelompok, Total Skor</code>
                        <p className="mt-2 italic opacity-70 text-[11px]">Pastikan nama santri sesuai dengan yang terdaftar di sistem agar data dapat disinkronkan.</p>
                    </div>
                </div>

                <Button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className="w-full h-16 rounded-2xl text-lg font-black shadow-lg shadow-primary/20 transition-all active:scale-95 uppercase tracking-widest"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                            Sedang Memproses...
                        </>
                    ) : (
                        "Import Sekarang"
                    )}
                </Button>

                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "p-6 rounded-2xl border-2 flex gap-4 items-start",
                            result.success ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-rose-50 border-rose-100 text-rose-800"
                        )}
                    >
                        {result.success ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <AlertCircle className="h-6 w-6 text-rose-500" />}
                        <div>
                            <p className="font-black uppercase tracking-widest text-[12px] mb-1">
                                {result.success ? "Berhasil!" : "Gagal!"}
                            </p>
                            <p className="text-sm font-medium">{result.message}</p>
                            {result.details && (
                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div className="bg-white/50 p-3 rounded-xl border border-emerald-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Diproses</p>
                                        <p className="text-xl font-black text-emerald-600">{result.details.processed}</p>
                                    </div>
                                    <div className="bg-white/50 p-3 rounded-xl border border-emerald-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Ditambahkan</p>
                                        <p className="text-xl font-black text-emerald-600">{result.details.added}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
