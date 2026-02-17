"use client";

import { useState } from "react";
import { Camera, Send } from "lucide-react";

interface ActionSlideProps {
    data: {
        title: string;
        description: string;
    };
    onComplete: (data: any) => void;
}

export default function ActionSlide({ data, onComplete }: ActionSlideProps) {
    const [report, setReport] = useState("");

    // In a real PWA, we would interact with camera.
    // Here we simulate file upload or just text.

    return (
        <div className="w-full max-w-sm space-y-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-primary text-center">{data.title}</h2>
            <p className="text-muted-foreground text-center">{data.description}</p>

            <textarea
                className="w-full h-32 p-4 rounded-xl border border-border bg-muted/20 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ceritakan pengalamanmu..."
                value={report}
                onChange={(e) => setReport(e.target.value)}
            />

            <button className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-full font-bold shadow-sm hover:opacity-90 transition-opacity">
                <Camera className="h-5 w-5" />
                <span>Upload Foto / Bukti</span>
            </button>

            <button
                onClick={() => onComplete({ report })}
                disabled={report.length < 10}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                <Send className="h-5 w-5" />
                <span>Kirim Laporan</span>
            </button>
        </div>
    );
}
