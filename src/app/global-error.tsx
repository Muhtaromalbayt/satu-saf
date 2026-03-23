"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global crash terdeteksi:", error);
  }, [error]);

  return (
    <html lang="id">
      <body className="bg-slate-900 text-slate-100 antialiased font-sans">
        <div className="min-h-screen flex flex-col items-center justify-center p-5 text-center">
          <div className="max-w-md w-full bg-slate-800 p-8 rounded-[2rem] border border-rose-500/30">
            <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
            <h1 className="text-2xl font-black text-white mb-2">Aplikasi Terhenti</h1>
            <p className="text-slate-400 mb-6 text-sm">
              Sistem tidak dapat memuat root layout karena kesalahan fatal (misalnya kegagalan plugin atau ekstensi perangkat).
            </p>
            <button
              onClick={() => reset()}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Muat Ulang Aplikasi
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
