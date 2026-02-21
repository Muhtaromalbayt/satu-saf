"use client";

import { useState } from "react";
import { ExternalLink, Maximize2 } from "lucide-react";

interface MaterialSlideProps {
    data: {
        title: string;
        description?: string;
        url: string; // Google Drive URL or ID
        type: 'pdf' | 'video' | 'image' | 'slide';
    };
    onComplete: () => void;
}

export default function MaterialSlide({ data, onComplete }: MaterialSlideProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    // Helper to extract file ID and construct preview URL
    const getEmbedUrl = (url: string) => {
        let fileId = url;
        // Try to extract ID from standard URLs
        // e.g. https://drive.google.com/file/d/123456789/view
        const match = url.match(/\/d\/(.+?)\//);
        if (match && match[1]) {
            fileId = match[1];
        }

        return `https://drive.google.com/file/d/${fileId}/preview`;
    };

    const embedUrl = getEmbedUrl(data.url);

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-8 h-full min-h-[500px]">
            <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight">{data.title}</h2>
                {data.description && (
                    <p className="text-slate-500 font-bold max-w-lg mx-auto text-lg leading-relaxed">{data.description}</p>
                )}
            </div>

            <div className="w-full flex-1 bg-slate-100 rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl relative min-h-[450px]">
                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                        <div className="animate-pulse flex flex-col items-center gap-4">
                            <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-emerald-500 animate-spin" />
                            <span className="font-black text-slate-400 uppercase tracking-widest text-xs">Menyiapkan Materi...</span>
                        </div>
                    </div>
                )}
                <iframe
                    src={embedUrl}
                    className="w-full h-full absolute inset-0"
                    allow="autoplay"
                    onLoad={() => setIsLoaded(true)}
                />
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full max-w-xl pt-4">
                <a
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-5 px-6 bg-white border-4 border-slate-100 text-slate-600 font-black rounded-[2rem] flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-emerald-100 transition-all uppercase tracking-widest text-sm shadow-lg"
                >
                    <ExternalLink className="w-5 h-5 text-emerald-500" />
                    Buka File Asli
                </a>
                <button
                    onClick={onComplete}
                    className="flex-1 py-5 px-6 bg-emerald-500 text-white font-black rounded-[2rem] shadow-xl shadow-emerald-200 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm"
                >
                    Tandai Selesai & Lanjut
                </button>
            </div>
        </div>
    );
}
