"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to application insights or just the console
    console.error("Client-side Exception tertangkap di ErrorBoundary:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-5 text-center bg-slate-50">
      <div className="max-w-md w-full bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        {/* Decorative background blast */}
        <div className="absolute inset-0 bg-rose-50 opacity-50" />
        
        <div className="relative z-10 flex flex-col items-center">
            <div className="h-20 w-20 bg-rose-50 rounded-3xl flex items-center justify-center mb-6 border border-rose-100">
                <AlertTriangle className="h-10 w-10 text-rose-500" />
            </div>
            
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">
            Terjadi Kesalahan
          </h1>
          <p className="text-slate-500 font-medium text-sm mb-6 leading-relaxed">
            Sistem mendeteksi kesalahan pada tampilan klien. Biasanya ini terjadi karena gangguan koneksi saat mengambil data atau perbedaan cache di profil Safari/Chrome.
          </p>

          <div className="flex flex-col w-full gap-3">
            <Button
              onClick={() => reset()}
              size="lg"
              className="w-full rounded-2xl bg-primary hover:bg-primary/90 active:scale-95 transition-transform text-white font-black uppercase tracking-widest text-xs h-14 flex items-center justify-center gap-3"
            >
              <RefreshCcw className="h-5 w-5" />
              Coba Muat Ulang
            </Button>
            
            <Link href="/" className="w-full">
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-2xl bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 active:scale-95 transition-all text-slate-500 font-black uppercase tracking-widest text-xs h-14 flex items-center justify-center gap-3"
              >
                <Home className="h-5 w-5" />
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
