"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, RefreshCw, Check, X, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface CameraCaptureProps {
    onCapture: (base64: string, timestamp: string) => void;
    onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [timestamp, setTimestamp] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
                audio: false,
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext("2d");
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Add timestamp overlay to the image
                const now = new Date();
                const timeStr = now.toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                });

                context.font = "bold 20px Arial";
                context.fillStyle = "white";
                context.strokeStyle = "black";
                context.lineWidth = 3;
                const padding = 20;
                context.strokeText(timeStr, padding, canvas.height - padding);
                context.fillText(timeStr, padding, canvas.height - padding);

                const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
                setCapturedImage(dataUrl);
                setTimestamp(now.toISOString());
            }
        }
    };

    const handleConfirm = () => {
        if (capturedImage && timestamp) {
            onCapture(capturedImage, timestamp);
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
        setTimestamp(null);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                {!capturedImage ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <img
                        src={capturedImage}
                        alt="Captured"
                        className="h-full w-full object-cover"
                    />
                )}

                {/* Header Controls */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
                    <button
                        onClick={onClose}
                        className="h-12 w-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <div className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/20 flex items-center gap-2">
                        <Timer className="h-3 w-3 text-emerald-400" />
                        Live Photo
                    </div>
                </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {/* Bottom Controls */}
            <div className="h-32 bg-slate-900 flex items-center justify-center px-10 gap-8">
                {!capturedImage ? (
                    <button
                        onClick={takePhoto}
                        className="h-20 w-20 rounded-full border-8 border-white/20 flex items-center justify-center"
                    >
                        <div className="h-14 w-14 rounded-full bg-white shadow-lg active:scale-90 transition-transform" />
                    </button>
                ) : (
                    <>
                        <button
                            onClick={handleRetake}
                            className="flex-1 h-14 rounded-2xl bg-white/10 text-white font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/20 transition-all border border-white/10"
                        >
                            <RefreshCw className="h-5 w-5" />
                            ULANG
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 h-14 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                        >
                            <Check className="h-5 w-5" />
                            GUNAKAN
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
