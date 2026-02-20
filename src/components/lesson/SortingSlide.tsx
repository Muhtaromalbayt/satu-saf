
"use client";

import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { CheckCircle2, GripVertical } from "lucide-react";

interface SortingSlideProps {
    data: {
        title: string;
        description?: string;
        items: { id: string; label: string }[];
        correctOrder: string[]; // array of IDs
    };
    onComplete: (success: boolean) => void;
}

export default function SortingSlide({ data, onComplete }: SortingSlideProps) {
    const [items, setItems] = useState(data.items);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const handleCheck = () => {
        const currentOrder = items.map(item => item.id);
        const correct = JSON.stringify(currentOrder) === JSON.stringify(data.correctOrder);
        setIsCorrect(correct);
        if (correct) {
            setTimeout(() => onComplete(true), 1500);
        } else {
            // Reset after a delay
            setTimeout(() => setIsCorrect(null), 2000);
        }
    };

    return (
        <div className="flex flex-col h-full max-w-2xl mx-auto p-4 space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{data.title}</h2>
                {data.description && (
                    <p className="text-slate-500 font-bold">{data.description}</p>
                )}
            </div>

            <Reorder.Group
                axis="y"
                values={items}
                onReorder={setItems}
                className="space-y-4"
            >
                {items.map((item) => (
                    <Reorder.Item
                        key={item.id}
                        value={item}
                        className={`
                            p-5 rounded-2xl border-2 cursor-grab active:cursor-grabbing flex items-center gap-4 bg-white transition-all
                            ${isCorrect === true ? "border-emerald-500 bg-emerald-50" :
                                isCorrect === false ? "border-red-500 bg-red-50" :
                                    "border-slate-200 shadow-sm hover:border-primary/20 hover:bg-slate-50"}
                        `}
                    >
                        <GripVertical className="h-5 w-5 text-slate-400 shrink-0" />
                        <span className="flex-1 font-black text-slate-700 text-lg">{item.label}</span>
                        {isCorrect === true && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-emerald-500"
                            >
                                <CheckCircle2 className="h-6 w-6" />
                            </motion.div>
                        )}
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <div className="pt-8">
                <button
                    onClick={handleCheck}
                    disabled={isCorrect === true}
                    className={`
                        w-full py-5 rounded-[2rem] font-black text-xl uppercase tracking-widest transition-all shadow-lg
                        ${isCorrect === true ? "bg-emerald-500 text-white" : "bg-primary text-white hover:scale-[1.02] active:scale-95 shadow-primary/30"}
                    `}
                >
                    {isCorrect === true ? "BENAR!" : "PERIKSA URUTAN"}
                </button>
            </div>
        </div>
    );
}
