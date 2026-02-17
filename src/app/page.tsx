"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, BookOpen, HeartHandshake } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <h1 className="relative text-4xl font-extrabold text-primary tracking-tight">SATU SAF</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-xs mx-auto">
          Journey to Taqwa <br /> Sanlat Ramadhan 1447 H
        </p>
      </div>

      {/* Role Selection */}
      <div className="w-full max-w-sm space-y-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
        <p className="text-center text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">
          Pilih Peranmu
        </p>

        <Link href="/login?role=student" className="block">
          <Button variant="default" size="lg" className="w-full text-lg h-16 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all" fullWidth>
            <User className="mr-3 h-6 w-6" />
            SANTRI
          </Button>
        </Link>

        <Link href="/login?role=parent" className="block">
          <Button variant="outline" size="lg" className="w-full text-lg h-16 rounded-2xl border-2 hover:bg-slate-50 hover:scale-[1.02] active:scale-95 transition-all" fullWidth>
            <HeartHandshake className="mr-3 h-6 w-6" />
            ORANG TUA
          </Button>
        </Link>

        <Link href="/login?role=mentor" className="block">
          <Button variant="secondary" size="lg" className="w-full text-lg h-16 rounded-2xl bg-slate-800 text-white hover:bg-slate-900 hover:scale-[1.02] active:scale-95 transition-all" fullWidth>
            <BookOpen className="mr-3 h-6 w-6" />
            MENTOR
          </Button>
        </Link>
      </div>

      <div className="absolute bottom-6 text-xs text-muted-foreground/50">
        Masjid Nurul Falah &copy; 1447 H
      </div>
    </div>
  );
}
