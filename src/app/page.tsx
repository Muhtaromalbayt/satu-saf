"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, BookOpen, HeartHandshake, Map as MapIcon, Trophy, Zap, Flame, Heart, Star, Calendar, Sparkles } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { motion } from "framer-motion";

export default function LandingPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-14 pb-8 md:pt-20 md:pb-12 px-5 bg-white border-b border-slate-100">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-72 h-72 md:w-96 md:h-96 bg-primary/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 md:w-64 md:h-64 bg-orange-500/5 blur-3xl rounded-full" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black tracking-widest uppercase mb-4 md:mb-6"
          >
            <Sparkles className="h-3 w-3" /> RAMADHAN 1447 H
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl md:text-5xl lg:text-7xl font-black text-slate-800 tracking-tight leading-tight mb-3 md:mb-6"
          >
            Satu Saf <br />
            <span className="text-primary italic">Journey to Taqwa</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-sm md:text-lg lg:text-xl max-w-2xl mx-auto mb-6 md:mb-10 leading-relaxed px-2"
          >
            Rasakan pengalaman ajaib Pesantren Ramadhan Masjid Nurul Falah dengan sistem belajar berbasis game yang seru dan interaktif!
          </motion.p>

          {!user && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-56 h-14 rounded-2xl text-base font-black shadow-lg shadow-primary/20 transition-transform active:scale-95 uppercase tracking-wider">
                  Mulai Petualangan
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-56 h-14 rounded-2xl text-base font-bold border-2 transition-transform active:scale-95 uppercase tracking-wider bg-white">
                  Daftar Akun
                </Button>
              </Link>
            </motion.div>
          )}

          {user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center"
            >
              <Link href="/map">
                <Button size="lg" className="px-8 h-14 rounded-2xl text-base font-black shadow-lg shadow-primary/20 transition-transform active:scale-95 flex items-center gap-2">
                  <MapIcon className="h-5 w-5" /> LANJUTKAN PERJALANAN
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features/Activities Grid */}
      <section className="py-10 md:py-20 px-5 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="h-12 w-12 md:h-16 md:w-16 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
              <MapIcon className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
            </div>
            <h3 className="text-lg md:text-xl font-black text-slate-800 mb-1.5 uppercase tracking-tight">Interactive Map</h3>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
              Jelajahi setiap bab pelajaran melalui peta petualangan yang interaktif dan seru.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="h-12 w-12 md:h-16 md:w-16 bg-emerald-50 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-emerald-500" />
            </div>
            <h3 className="text-lg md:text-xl font-black text-slate-800 mb-1.5 uppercase tracking-tight">Tadarus Online</h3>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
              Catat dan pantau progres tadarus harianmu serta kumpulkan poin kebaikan.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="h-12 w-12 md:h-16 md:w-16 bg-amber-50 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
              <Trophy className="h-6 w-6 md:h-8 md:w-8 text-amber-500" />
            </div>
            <h3 className="text-lg md:text-xl font-black text-slate-800 mb-1.5 uppercase tracking-tight">Leaderboard</h3>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
              Bersaing secara sehat dengan teman-teman lain untuk menjadi yang terbaik.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gamification Preview */}
      <section className="bg-slate-900 py-14 md:py-24 px-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16 relative z-10">
          <div className="flex-1 space-y-5 md:space-y-8">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">Belajar Agama dengan Cara yang <span className="text-primary italic">Asyik</span></h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/10">
                <div className="h-9 w-9 md:h-10 md:w-10 bg-red-500 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/20 shrink-0">
                  <Heart className="h-5 w-5 text-white fill-current" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Health System</h4>
                  <p className="text-slate-400 text-xs">Jaga &quot;Hati&quot;-mu dengan menjawab pertanyaan dengan benar.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/10">
                <div className="h-9 w-9 md:h-10 md:w-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
                  <Flame className="h-5 w-5 text-white fill-current" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Daily Streak</h4>
                  <p className="text-slate-400 text-xs">Jangan biarkan api semangat padam! Belajar setiap hari.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/10">
                <div className="h-9 w-9 md:h-10 md:w-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                  <Zap className="h-5 w-5 text-white fill-current" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">XP & Level</h4>
                  <p className="text-slate-400 text-xs">Kumpulkan XP dan tingkatkan level ketakwaanmu.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative"
            >
              <div className="w-40 h-40 md:w-64 md:h-64 bg-primary/20 blur-[60px] md:blur-[80px] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              <div className="w-40 h-40 md:w-64 md:h-64 bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl flex items-center justify-center relative border-4 md:border-8 border-slate-800">
                <div className="flex flex-col items-center">
                  <Star className="h-16 w-16 md:h-24 md:w-24 text-primary fill-primary animate-pulse" />
                  <span className="mt-2 md:mt-4 font-black text-slate-800 text-lg md:text-2xl tracking-widest">RANK 1</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-12 px-5 border-t border-slate-200 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Link href="/login?role=parent" className="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors">ORANG TUA</Link>
            <span className="text-slate-300">•</span>
            <Link href="/login?role=mentor" className="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors">MENTOR</Link>
            <span className="text-slate-300">•</span>
            <Link href="/login?role=student" className="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors">SANTRI</Link>
            <span className="text-slate-300">•</span>
            <Link href="/login?role=admin" className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors">ADMIN</Link>
          </div>
          <p className="text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase">Masjid Nurul Falah &copy; 1447 H / 2026 M</p>
        </div>
      </footer>
    </div>
  );
}
