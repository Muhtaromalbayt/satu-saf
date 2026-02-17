"use client";

import { useState } from "react";
import { Check, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MentorDashboard() {
    const [pendingApprovals, setPendingApprovals] = useState([
        { id: 1, student: "Ahmad", action: "Membersihkan Halaman", proof: "Image", status: "pending" },
        { id: 2, student: "Fatima", action: "Membaca Al-Mulk", proof: "Audio", status: "pending" },
    ]);

    const handleApprove = (id: number) => {
        setPendingApprovals(prev => prev.filter(item => item.id !== id));
        // Verify Logic here
    };

    return (
        <div className="p-6 pb-24">
            <h1 className="text-2xl font-bold text-primary mb-6">Mentor Dashboard</h1>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-muted-foreground uppercase tracking-widest">
                    Menunggu Persetujuan
                </h2>

                {pendingApprovals.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Semua tugas sudah diperiksa! 🎉</p>
                ) : (
                    pendingApprovals.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">{item.student}</p>
                                    <p className="text-sm text-muted-foreground">{item.action}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button size="icon" variant="danger" onClick={() => handleApprove(item.id)}>
                                    <X className="h-5 w-5" />
                                </Button>
                                <Button size="icon" variant="default" className="bg-green-500 hover:bg-green-600 border-green-700" onClick={() => handleApprove(item.id)}>
                                    <Check className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                    Progress Santri
                </h2>
                {/* Placeholder for student list */}
                <div className="p-4 bg-muted/20 rounded-xl text-center text-muted-foreground text-sm">
                    Daftar santri akan muncul di sini.
                </div>
            </div>
        </div>
    );
}
