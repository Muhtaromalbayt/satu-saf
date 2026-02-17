"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, RefreshCw } from "lucide-react";
import { isSpeechRecognitionSupported } from "@/lib/speech";
import { cn } from "@/lib/utils";

interface ReciteSlideProps {
    data: {
        verseText: string;
        targetString: string; // The text to match (can be Latin or simplified Arabic)
        surahName: string;
        translation?: string;
    };
    onComplete: (isSuccess: boolean) => void;
}

export default function ReciteSlide({ data, onComplete }: ReciteSlideProps) {
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        setIsSupported(isSpeechRecognitionSupported());
    }, []);

    // Placeholder for Web Speech API logic
    const toggleListening = () => {
        if (!isSupported) {
            alert("Browser does not support Web Speech API");
            return;
        }

        if (listening) {
            setListening(false);
        } else {
            setListening(true);
            setTranscript("Simulated recitation...");

            // For prototype, we simulate checking after 3 seconds
            setTimeout(() => {
                setListening(false);
                setTranscript(data.targetString); // Perfect match simulation
                onComplete(true);
            }, 3000);
        }
    };

    const words = data.verseText.split(" ");

    return (
        <div className="flex flex-col items-center space-y-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-primary">{data.surahName}</h2>

            <div className="text-4xl font-arabic leading-[1.8] text-center dir-rtl mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner w-full">
                {words.map((word, i) => (
                    <span key={i} className={cn(
                        "mx-1 transition-colors drop-shadow-sm",
                        transcript.toLowerCase().includes(word.toLowerCase()) ? "text-green-600" : "text-slate-800"
                    )}>
                        {word}
                    </span>
                ))}
            </div>

            {data.translation && (
                <p className="text-sm text-muted-foreground italic text-center max-w-[280px]">
                    "{data.translation}"
                </p>
            )}

            <div className="p-4 bg-muted/50 rounded-xl w-full text-center text-sm font-mono text-muted-foreground min-h-[60px]">
                {transcript || "Tap microphone and recite..."}
            </div>

            <button
                onClick={toggleListening}
                className={cn(
                    "h-20 w-20 rounded-full flex items-center justify-center shadow-2xl transition-all",
                    listening ? "bg-red-500 animate-pulse text-white" : "bg-primary text-primary-foreground"
                )}
            >
                {listening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </button>

            {!isSupported && (
                <p className="text-xs text-red-500">
                    Speech recognition not supported in this browser.
                </p>
            )}
        </div>
    );
}
