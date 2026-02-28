"use client";

import ParentMonitor from "@/components/ParentMonitor";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ParentDashboard() {
    return (
        <div className="p-6 pb-24">
            <h1 className="text-2xl font-bold text-primary mb-2">Halo, Ayah/Bunda!</h1>
            <p className="text-muted-foreground mb-8">Pantau perkembangan ananda di sini.</p>

            {/* Parent Monitor Component */}
            <ParentMonitor />

            {/* Encouragement Section */}
            <div className="space-y-4 mt-8">
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
