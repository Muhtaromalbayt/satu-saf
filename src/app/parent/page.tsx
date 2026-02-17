"use client";

import { MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ParentDashboard() {
    return (
        <div className="p-6 pb-24">
            <h1 className="text-2xl font-bold text-primary mb-2">Halo, Ayah/Bunda!</h1>
            <p className="text-muted-foreground mb-8">Pantau perkembangan ananda di sini.</p>

            {/* Child Summary Card */}
            <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 rounded-2xl shadow-lg mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold">Ahmad</h2>
                        <p className="text-primary-foreground/80 text-sm">Level 3 • Pejuang Subuh</p>
                    </div>
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <span className="text-2xl font-bold">💎 450</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Progress Mingguan</span>
                        <span>80%</span>
                    </div>
                    <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full bg-secondary w-[80%]" />
                    </div>
                </div>
            </div>

            {/* Encouragement Section */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-muted-foreground uppercase tracking-widest">
                    Beri Semangat
                </h2>

                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                        <span className="text-2xl">🌟</span>
                        <span className="text-xs">Hebat!</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                        <span className="text-2xl">💪</span>
                        <span className="text-xs">Terus Berjuang</span>
                    </Button>
                </div>

                <div className="mt-4">
                    <textarea
                        className="w-full p-4 rounded-xl border border-border bg-muted/20 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Tulis pesan penyemangat khusus..."
                        rows={3}
                    />
                    <Button className="w-full mt-2" variant="secondary">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Kirim Pesan
                    </Button>
                </div>
            </div>
        </div>
    );
}
