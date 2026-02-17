"use client";

import { User } from "lucide-react";
import { useGamification } from "@/context/GamificationContext";

export default function ProfilePage() {
    const { xp, hearts, streak } = useGamification();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center pb-24">
            <div className="bg-green-100 p-6 rounded-full mb-6">
                <User className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2">Profil Santri</h1>
            <p className="text-muted-foreground mb-8">
                Terus semangat beribadah!
            </p>

            <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center">
                    <span className="text-2xl mb-1">🔥</span>
                    <span className="font-bold text-lg">{streak}</span>
                    <span className="text-xs text-muted-foreground">Streak</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center">
                    <span className="text-2xl mb-1">💎</span>
                    <span className="font-bold text-lg">{xp}</span>
                    <span className="text-xs text-muted-foreground">XP</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center">
                    <span className="text-2xl mb-1">❤️</span>
                    <span className="font-bold text-lg">{hearts}</span>
                    <span className="text-xs text-muted-foreground">Nyawa</span>
                </div>
            </div>
        </div>
    );
}
