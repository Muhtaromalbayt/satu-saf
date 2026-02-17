"use client";

import { motion, AnimatePresence } from "framer-motion";
import Mascot from "./Mascot";
import { useEffect, useState } from "react";
import { useSound } from "@/hooks/useSound";

interface MascotToastProps {
    isVisible: boolean;
    message: string;
    pose?: "success" | "cheer" | "thinking" | "idle";
    onClose: () => void;
}

export default function MascotToast({ isVisible, message, pose = "success", onClose }: MascotToastProps) {
    const { playSound } = useSound();

    useEffect(() => {
        if (isVisible) {
            playSound('boing');
            const timer = setTimeout(() => {
                onClose();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose, playSound]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ x: 100, opacity: 0, scale: 0.5 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: 100, opacity: 0, scale: 0.5 }}
                    className="fixed bottom-24 right-4 z-[150] pointer-events-none"
                >
                    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-3xl border-2 border-primary/20 shadow-2xl pointer-events-auto">
                        <Mascot
                            pose={pose}
                            showSpeechBubble
                            speechText={message}
                            className="scale-75 origin-bottom-right"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
