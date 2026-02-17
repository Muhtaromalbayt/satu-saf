import { motion, AnimatePresence, Variants } from "framer-motion";
import { CheckCircle2, XCircle, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Mascot, { MascotPose } from "@/components/gamification/Mascot";

import { useSound } from "@/hooks/useSound";
import { useEffect } from "react";

type FeedbackType = 'success' | 'mission_complete' | 'heart_lost';

interface FeedbackModalProps {
    isOpen: boolean;
    type: FeedbackType;
    message: string;
    onClose: () => void;
}

const FEEDBACK_CONFIG = {
    success: {
        icon: CheckCircle2,
        color: 'text-green-500',
        bg: 'bg-green-50',
        mascotPose: 'happy' as MascotPose,
        sound: 'correct' as const
    },
    mission_complete: {
        icon: Star,
        color: 'text-amber-500',
        bg: 'bg-amber-50',
        mascotPose: 'cheer' as MascotPose,
        sound: 'victory' as const
    },
    heart_lost: {
        icon: XCircle,
        color: 'text-red-500',
        bg: 'bg-red-50',
        mascotPose: 'oops' as MascotPose,
        sound: 'incorrect' as const
    }
};

export default function FeedbackModal({ isOpen, type, message, onClose }: FeedbackModalProps) {
    const config = FEEDBACK_CONFIG[type];
    const { playSound } = useSound();

    useEffect(() => {
        if (isOpen) {
            playSound(config.sound);
        }
    }, [isOpen, type, playSound, config.sound]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
                    >
                        {/* Mascot Overlay Background */}
                        <div className={`absolute top-0 inset-x-0 h-48 ${config.bg} -z-10`} />

                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="mb-4"
                        >
                            <Mascot
                                pose={config.mascotPose}
                                className="scale-125"
                                showSpeechBubble={type === 'heart_lost'}
                                speechText="Ayo coba lagi!"
                            />
                        </motion.div>

                        <div className="space-y-2 mb-8">
                            <h2 className={`text-2xl font-black ${config.color} uppercase tracking-tight`}>
                                {type === 'success' ? 'Luar Biasa!' : type === 'mission_complete' ? 'Misi Selesai!' : 'Ouch! Hati Berkurang'}
                            </h2>
                            <p className="text-slate-600 font-medium">
                                {message}
                            </p>
                        </div>

                        <Button
                            variant={type === 'heart_lost' ? 'danger' : 'default'}
                            fullWidth
                            size="lg"
                            onClick={onClose}
                        >
                            Lanjutkan
                        </Button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
