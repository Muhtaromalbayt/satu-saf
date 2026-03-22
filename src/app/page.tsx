"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, BookOpen, HeartHandshake, Map as MapIcon, Trophy, Zap, Flame, Heart, Star, Calendar, Sparkles, Compass, Rocket, ChevronRight, ShieldCheck, Target } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const [isHovered, setIsHovered] = useState<string | null>(null);
  
  // Parallax scrolling setup
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <div className="absolute inset-2 border-4 border-amber-500/20 border-b-amber-500 rounded-full animate-spin-reverse" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-emerald-400 animate-pulse" />
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };
  
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden font-sans text-slate-100 selection:bg-emerald-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-amber-500/15 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-teal-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[100svh] flex items-center justify-center pt-20 pb-16 px-5 z-10">
        <motion.div style={{ y: yBg, opacity: opacityHero }} className="max-w-5xl mx-auto w-full text-center relative">
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full mb-8 shadow-xl shadow-emerald-500/5 group hover:bg-white/10 transition-colors cursor-default"
          >
            <Sparkles className="h-4 w-4 text-amber-400" /> 
            <span className="text-xs font-black tracking-widest uppercase bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">RAMADHAN 1447 H</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
          </motion.div>

          {/* 3D-like Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="relative mb-8 md:mb-10"
          >
            <h1 className="text-6xl md:text-8xl lg:text-[8rem] font-black tracking-tighter leading-[0.9] text-white my-0 uppercase">
              SATU <span className="text-emerald-500 inline-block hover:scale-105 transition-transform duration-300">SAF</span>
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent blur-2xl -z-10" />
            <div className="mt-4 md:mt-6 overflow-hidden">
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "circOut" }}
                className="inline-flex items-center gap-3 md:gap-4 text-xl md:text-3xl lg:text-4xl text-emerald-200/80 italic font-serif"
              >
                <Compass className="h-6 w-6 md:h-10 md:w-10 text-amber-400" />
                Journey to Taqwa
              </motion.div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-slate-300 text-base md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed px-4 font-medium"
          >
            Ubah ibadah harianmu menjadi petualangan epik. Pantau amal yaumi, kumpulkan harta karun pahala, dan bersaing dalam kebaikan selama 14 hari penuh di bulan suci.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-6"
          >
            {!user ? (
              <Link href="/login" className="w-full sm:w-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500 group-hover:duration-200" />
                <Button size="lg" className="relative w-full sm:w-72 h-16 rounded-2xl bg-slate-900 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-transparent text-lg font-black shadow-none transition-all duration-300 active:scale-95 uppercase tracking-widest flex items-center gap-3 overflow-hidden">
                  Mulai Petualangan <Rocket className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-[-1]" />
                </Button>
              </Link>
            ) : (
              <Link href="/map" className="w-full sm:w-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-500" />
                <Button size="lg" className="relative w-full sm:w-72 h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white border-none text-lg font-black shadow-none transition-all active:scale-95 flex items-center gap-3 uppercase tracking-widest">
                  <MapIcon className="h-6 w-6" /> Lanjutkan Peta
                </Button>
              </Link>
            )}
            
            {!user && (
              <Link href="#features" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                Jelajahi Fitur <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </motion.div>

          {/* Floating animated elements */}
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 -left-10 md:left-10 opacity-30 pointer-events-none"
          >
            <Target className="h-16 w-16 text-emerald-400" />
          </motion.div>
          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-40 -right-5 md:right-10 opacity-30 pointer-events-none"
          >
            <Trophy className="h-20 w-20 text-amber-500" />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent" />
        </motion.div>
      </section>

      {/* Interactive Features Grid */}
      <section id="features" className="py-24 px-5 max-w-6xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">Fitur <span className="text-emerald-500">Unggulan</span></h2>
          <p className="text-slate-400 font-medium max-w-xl mx-auto">Sistem yang dirancang khusus untuk membuat ibadah dan rutinitas positif menjadi lebih menyenangkan.</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {/* Card 1 */}
          <motion.div
            variants={itemVariants}
            onMouseEnter={() => setIsHovered('map')}
            onMouseLeave={() => setIsHovered(null)}
            className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-500 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-slate-700 group-hover:border-emerald-500/50 shadow-lg relative overflow-hidden">
                <AnimatePresence>
                  {isHovered === 'map' && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 2, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute inset-0 bg-emerald-500/20 blur-md rounded-full"
                    />
                  )}
                </AnimatePresence>
                <MapIcon className="h-8 w-8 text-emerald-400 relative z-10" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">Peta Perjalanan</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                Selesaikan 14 node rute perjalanan layaknya game RPG. Setiap hari membuka misi baru yang harus ditaklukkan.
              </p>
            </div>
            {/* Corner decoration */}
            <div className="absolute -bottom-8 -right-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 rotate-12">
              <MapIcon className="h-40 w-40 text-emerald-500" />
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={itemVariants}
            onMouseEnter={() => setIsHovered('shield')}
            onMouseLeave={() => setIsHovered(null)}
            className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-700/50 hover:border-amber-500/30 transition-all duration-500 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-slate-700 group-hover:border-amber-500/50 shadow-lg relative overflow-hidden">
                <AnimatePresence>
                  {isHovered === 'shield' && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 2, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute inset-0 bg-amber-500/20 blur-md rounded-full"
                    />
                  )}
                </AnimatePresence>
                <ShieldCheck className="h-8 w-8 text-amber-400 relative z-10" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">Sistem Validasi</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                Unggah bukti foto dan catatan kejujuran. Mentor akan memverifikasi setiap amalanmu untuk memastikan integritas.
              </p>
            </div>
            <div className="absolute -bottom-8 -right-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 -rotate-12">
              <ShieldCheck className="h-40 w-40 text-amber-500" />
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={itemVariants}
            onMouseEnter={() => setIsHovered('trophy')}
            onMouseLeave={() => setIsHovered(null)}
            className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-700/50 hover:border-rose-500/30 transition-all duration-500 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-slate-700 group-hover:border-rose-500/50 shadow-lg relative overflow-hidden">
                <AnimatePresence>
                  {isHovered === 'trophy' && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 2, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute inset-0 bg-rose-500/20 blur-md rounded-full"
                    />
                  )}
                </AnimatePresence>
                <Trophy className="h-8 w-8 text-rose-400 relative z-10" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">Peringkat & Hadiah</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                Kumpulkan poin terbanyak, capai tier tertinggi, dan dapatkan pengakuan sebagai santri teladan di leaderboard.
              </p>
            </div>
            <div className="absolute -bottom-8 -right-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 rotate-45">
              <Trophy className="h-40 w-40 text-rose-500" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Mechanics / Gamification Showcase */}
      <section className="py-24 relative overflow-hidden border-y border-slate-800 bg-slate-900/50 backdrop-blur-3xl z-10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-900/20 to-transparent" />
        <div className="max-w-6xl mx-auto px-5 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
          
          <div className="flex-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full mb-4">
                <Flame className="h-3 w-3 text-amber-500" />
                <span className="text-[10px] font-black tracking-widest uppercase text-amber-500">Mekanik Game</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] uppercase tracking-tight">Kumpulkan <br/><span className="text-emerald-500 bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Pahala</span> layaknya XP</h2>
            </motion.div>

            <div className="space-y-4">
              {[
                { icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Tugas Wajib & Harian", desc: "Dari Sholat 5 waktu hingga berbakti ke orang tua." },
                { icon: Star, color: "text-amber-400", bg: "bg-amber-500/10", label: "Misi Spesial (Bonus Poin)", desc: "Kejutan misi rahasia setiap harinya." },
                { icon: Zap, color: "text-blue-400", bg: "bg-blue-500/10", label: "Streak Combo", desc: "Selesaikan misi 3 hari berturut-turut untuk multiplier." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border border-white/5", item.bg)}>
                    <item.icon className={cn("h-6 w-6", item.color)} />
                  </div>
                  <div>
                    <h4 className="text-white font-extrabold text-[15px] uppercase tracking-wider mb-1 mt-0.5">{item.label}</h4>
                    <p className="text-slate-400 text-xs font-semibold">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full max-w-md lg:max-w-none relative flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="relative w-full aspect-square max-w-[400px]"
            >
              {/* Central Glowing Orb */}
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
              
              {/* Dashboard Preview Mock */}
              <div className="absolute inset-4 bg-slate-800 rounded-[2.5rem] border-4 border-slate-700 shadow-2xl overflow-hidden flex flex-col p-6">
                <div className="flex gap-4 items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 p-1 flex-shrink-0">
                    <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-800">
                      <User className="w-8 h-8 text-slate-100" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-slate-700 rounded-full mb-2" />
                    <div className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[8px] font-black uppercase tracking-widest inline-block rounded">RANK: ELITE</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl">
                      <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <div className="h-3 w-3/4 bg-slate-600 rounded-full mb-1.5" />
                        <div className="h-2 w-1/3 bg-slate-600 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
                </div>
              </div>

              {/* Floating badges */}
              <motion.div 
                animate={{ y: [0, -15, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-6 top-10 bg-slate-800 border-2 border-amber-500/30 p-3 rounded-2xl shadow-xl flex items-center gap-3"
              >
                <div className="bg-amber-500/20 p-2 rounded-xl"><Trophy className="w-5 h-5 text-amber-400 fill-amber-400" /></div>
                <div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Rank</div>
                  <div className="text-xl font-black text-white">#01</div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 15, 0] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -left-6 bottom-16 bg-slate-800 border-2 border-emerald-500/30 p-3 rounded-2xl shadow-xl flex items-center gap-3"
              >
                <div className="bg-emerald-500/20 p-2 rounded-xl"><Sparkles className="w-5 h-5 text-emerald-400" /></div>
                <div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Poin</div>
                  <div className="text-xl font-black text-white tabular-nums">1,450</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer / Login Links */}
      <footer className="py-16 px-5 border-t border-slate-800 text-center relative z-10 bg-slate-950">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          
          <div className="flex items-center gap-3 mb-8">
            <Compass className="h-8 w-8 text-emerald-500" />
            <h3 className="text-2xl font-black uppercase tracking-widest text-white">Satu<span className="text-emerald-500">Saf</span></h3>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-10">
            {[
              { role: "student", label: "SANTRI", color: "hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/50" },
              { role: "parent", label: "ORANG TUA", color: "hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/50" },
              { role: "mentor", label: "MENTOR", color: "hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/50" },
              { role: "admin", label: "ADMIN", color: "hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/50" }
            ].map(link => (
              <Link 
                key={link.role} 
                href={`/login?role=${link.role}`} 
                className={cn(
                  "px-4 py-2 border border-slate-800 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 text-slate-400 bg-slate-900",
                  link.color
                )}
              >
                Portal {link.label}
              </Link>
            ))}
          </div>

          <p className="text-[10px] font-black tracking-[0.3em] text-slate-600 uppercase flex items-center gap-2 justify-center">
            Masjid Nurul Falah <span className="text-emerald-500/50">•</span> 1447 H / 2026
          </p>
        </div>
      </footer>

      {/* Global Shimmer Animation definition for UI mock */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 15s infinite alternate;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

// Dummy icon for mock dashboard since CheckCircle2 wasn't imported top-level
function CheckCircle2(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
