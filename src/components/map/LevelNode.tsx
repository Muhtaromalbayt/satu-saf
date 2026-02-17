"use client";

import { motion } from "framer-motion";
import { BookOpen, Mic, Star, HandHeart, Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { NodeType, NodeStatus } from "@/lib/types";

interface LevelNodeProps {
    id: string;
    type: NodeType | 'quiz'; // supporting quiz as per mock data
    status: NodeStatus;
    label?: string;
    x: number; // percentage (0-100)
    y: number; // relative usage in flex or absolute
    onClick?: () => void;
    index: number;
}

const icons = {
    story: BookOpen,
    recite: Mic,
    quiz: Star,
    challenge: Star,
    action: HandHeart,
};

export default function LevelNode({ type, status, x, onClick, index }: LevelNodeProps) {
    const Icon = icons[type as keyof typeof icons] || Star;

    const isLocked = status === "locked";
    const isCompleted = status === "completed";
    const isActive = status === "active";

    // Calculate left offset based on sine wave pattern or similar for simple visualization
    // For now, we rely on the parent to pass 'x' or we calculate it here if index is passed.
    // Let's use the passed 'x' for flexibility.

    return (
        <div
            className="absolute flex flex-col items-center justify-center transform -translate-x-1/2"
            style={{ left: `${x}%`, top: `${index * 140}px` }} // Fixed vertical spacing to match spacing variable
        >
            <motion.button
                whileHover={!isLocked ? { scale: 1.05, y: -2 } : {}}
                whileTap={!isLocked ? { scale: 0.95, y: 2 } : {}}
                animate={isActive ? {
                    y: [0, -10, 0],
                    filter: ["drop-shadow(0 0 0px rgba(255,183,3,0))", "drop-shadow(0 0 20px rgba(255,183,3,0.4))", "drop-shadow(0 0 0px rgba(255,183,3,0))"]
                } : {}}
                transition={isActive ? { repeat: Infinity, duration: 2.5, ease: "easeInOut" } : {}}
                onClick={!isLocked ? onClick : undefined}
                className={cn(
                    "relative flex h-20 w-20 items-center justify-center rounded-full border-b-[6px] shadow-2xl transition-all",
                    isLocked ? "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed grayscale" :
                        isCompleted ? "bg-amber-400 border-amber-600 text-white" :
                            "bg-primary border-primary/60 text-primary-foreground" // Active
                )}
            >
                {isCompleted ? (
                    <Check className="h-10 w-10 stroke-[4] drop-shadow-sm" />
                ) : isLocked ? (
                    <Lock className="h-7 w-7 opacity-50" />
                ) : (
                    <Icon className="h-9 w-9 fill-current drop-shadow-md" />
                )}

                {/* Crown/Stars for Active? */}
                {isActive && (
                    <div className="absolute -top-12 z-10 w-max">
                        <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="bg-white px-4 py-1.5 rounded-2xl font-black text-[10px] shadow-lg text-primary border-2 border-primary/10 tracking-tighter"
                        >
                            MULAI
                        </motion.div>
                        <div className="w-0 h-0 border-l-[8px] border-l-transparent border-t-[10px] border-t-white border-r-[8px] border-r-transparent mx-auto relative -top-1.5 shadow-sm"></div>
                    </div>
                )}
            </motion.button>
        </div>
    );
}
