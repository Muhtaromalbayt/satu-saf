import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export type MascotPose = "success" | "thinking" | "cheer" | "idle";

interface MascotProps {
    pose?: MascotPose;
    className?: string;
    showSpeechBubble?: boolean;
    speechText?: string;
}

export default function Mascot({
    pose = "success",
    className,
    showSpeechBubble = false,
    speechText
}: MascotProps) {

    // Map poses to video assets (Only using success/Semangat as requested)
    const getVideoSrc = (p: MascotPose) => {
        return '/mascot/success.mp4';
    };

    return (
        <div className={cn("relative flex flex-col items-center", className)}>
            {/* Speech Bubble */}
            <AnimatePresence>
                {showSpeechBubble && speechText && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-2xl shadow-xl border-2 border-primary/20 min-w-[150px] text-center z-50 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-white"
                    >
                        <p className="text-sm font-bold text-slate-700 whitespace-nowrap">
                            {speechText}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Falah Mascot Video */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                className="relative w-40 h-40 overflow-hidden"
                style={{
                    // Aggressively mask the square frame and fade edges
                    WebkitMaskImage: 'radial-gradient(circle at center, black 45%, transparent 75%)',
                    maskImage: 'radial-gradient(circle at center, black 45%, transparent 75%)',
                }}
            >
                <video
                    key={pose}
                    src={getVideoSrc(pose)}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-contain mix-blend-multiply transition-all duration-300"
                    style={{
                        // Boost brightness and contrast to force the video background to pure white (transparent in multiply)
                        filter: 'brightness(1.15) contrast(1.1) saturate(1.1)',
                    }}
                />
            </motion.div>
        </div>
    );
}
