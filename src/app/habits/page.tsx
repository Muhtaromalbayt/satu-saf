"use client";

import HabitTracker from "@/components/HabitTracker";
import Mascot from "@/components/gamification/Mascot";
import { motion } from "framer-motion";

export default function HabitsPage() {
    return (
        <div className="p-6 pb-32 max-w-lg mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">AMALAN<br /><span className="text-primary italic">Kebaikan</span></h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target Harianmu</p>
                </div>
                <Mascot pose="success" className="h-20 w-20" />
            </header>

            <section>
                <HabitTracker />
            </section>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary/5 p-6 rounded-[2rem] border-2 border-primary/10"
            >
                <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
                    💡 Tips Hari Ini
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                    Satu kebaikan kecil yang dilakukan secara konsisten lebih dicintai Allah daripada kebaikan besar yang hanya sesekali. Semangat!
                </p>
            </motion.div>
        </div>
    );
}
