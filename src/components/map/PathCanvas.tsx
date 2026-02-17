import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud } from "lucide-react";
import LevelNode from "./LevelNode";
import { Chapter } from "@/lib/types";
import { MOCK_CHAPTERS } from "@/data/mockData";
import { useGamification } from "@/context/GamificationContext";
import Mascot from "../gamification/Mascot";
import { useState, useEffect } from "react";

interface PathCanvasProps {
    chapters?: Chapter[];
}

export default function PathCanvas({ chapters = MOCK_CHAPTERS }: PathCanvasProps) {
    const router = useRouter();
    const { completedNodes } = useGamification();

    const allNodes = chapters.flatMap(c => c.nodes);
    const spacing = 140;
    const totalHeight = allNodes.length * spacing + 300;

    // Find the active node index
    const activeIndex = allNodes.findIndex(node => !completedNodes.includes(node.id));
    const currentPos = activeIndex === -1 ? (allNodes.length > 0 ? allNodes.length - 1 : 0) : activeIndex;
    const xPos = getXPosition(currentPos);

    const [speechIndex, setSpeechIndex] = useState(0);
    const quotes = [
        "Ayo, satu langkah lagi!",
        "Masya Allah, teruskan!",
        "Journey to Taqwa menantimu!",
        "Semangat belajarnya, Falah!"
    ];

    useEffect(() => {
        // We could keep quotes for other uses, but user said "don't show in chapter"
        // Let's remove the interval to save resources as we won't use it here.
    }, []);

    const handleNodeClick = (nodeId: string, type: string) => {
        router.push(`/lesson/${nodeId}?type=${type}`);
    };

    return (
        <div
            className="relative w-full pb-40 overflow-visible"
            style={{ minHeight: `${totalHeight}px` }}
        >
            {/* Parallax Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0.2, x: (i * 20) % 100 + "%", y: i * 400 }}
                        animate={{
                            x: [((i * 20) % 100) - 10 + "%", ((i * 20) % 100) + 10 + "%"],
                        }}
                        transition={{
                            duration: 15 + Math.random() * 10,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "linear"
                        }}
                        className="absolute text-slate-200"
                    >
                        <Cloud className="h-20 w-20 fill-current opacity-50" />
                    </motion.div>
                ))}
            </div>

            {/* SVG Path Background */}
            <svg
                className="absolute top-0 left-0 w-full pointer-events-none overflow-visible"
                style={{ height: `${totalHeight}px` }}
                viewBox={`0 0 100 ${totalHeight}`}
                preserveAspectRatio="none"
            >
                <path
                    d={generatePath(allNodes.length, spacing)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="text-primary/10"
                    vectorEffect="non-scaling-stroke"
                    style={{ strokeWidth: '10px' }}
                />
            </svg>


            {/* Flat rendering of nodes to avoid relative parent issues */}
            {allNodes.map((node, globalIndex) => {
                // Dynamic Status Calculation
                let status = node.status;
                if (completedNodes.includes(node.id)) {
                    status = 'completed';
                } else {
                    const prevNodeIndex = globalIndex - 1;
                    if (prevNodeIndex >= 0) {
                        const prevNodeId = allNodes[prevNodeIndex].id;
                        if (completedNodes.includes(prevNodeId)) {
                            status = 'active';
                        } else {
                            status = 'locked';
                        }
                    } else {
                        status = 'active';
                    }
                }

                return (
                    <LevelNode
                        key={node.id}
                        {...node}
                        status={status as any}
                        // @ts-ignore
                        type={node.type}
                        x={getXPosition(globalIndex)}
                        y={0}
                        index={globalIndex}
                        onClick={() => handleNodeClick(node.id, node.type)}
                    />
                );
            })}
        </div>
    );
}

function generatePath(count: number, spacing: number) {
    const startY = 60;
    let d = `M 50 ${startY} `;

    for (let i = 0; i < count; i++) {
        const nextX = getXPosition(i + 1);
        const currentY = i * spacing + startY;
        const nextY = (i + 1) * spacing + startY;

        // Midpoint Y for smooth Bezier control
        const midY = (currentY + nextY) / 2;

        d += `C ${getXPosition(i)} ${midY}, ${nextX} ${midY}, ${nextX} ${nextY} `;
    }

    return d;
}

function getXPosition(index: number) {
    const sequence = [50, 30, 50, 70];
    return sequence[index % sequence.length];
}
