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
        <div className="w-full max-w-4xl flex flex-col items-center space-y-6 h-full min-h-[500px]">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-800">{data.title}</h2>
                {data.description && (
                    <p className="text-slate-500 max-w-lg mx-auto">{data.description}</p>
                )}
            </div>

            <div className="w-full flex-1 bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200 relative shadow-inner min-h-[400px]">
                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                        <div className="animate-pulse flex flex-col items-center gap-2">
                            <div className="h-8 w-8 rounded-full border-2 border-t-blue-500 animate-spin" />
                            <span>Memuat Materi...</span>
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

            <div className="flex gap-4 w-full max-w-sm">
                <a
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                >
                    <ExternalLink className="w-4 h-4" />
                    Buka di Drive
                </a>
                <button
                    onClick={onComplete}
                    className="flex-1 py-3 px-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:bg-primary/90 transition-colors"
                >
                    Selesai Membaca
                </button>
            </div>
        </div>
    );
}
