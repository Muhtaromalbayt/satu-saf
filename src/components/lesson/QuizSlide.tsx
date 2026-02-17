"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface QuizSlideProps {
    data: {
        question: string;
        options: string[];
        correctIndex: number;
    };
    onAnswer: (isCorrect: boolean) => void;
}

export default function QuizSlide({ data, onAnswer }: QuizSlideProps) {
    const [selected, setSelected] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const handleSelect = (index: number) => {
        if (submitted) return;
        setSelected(index);
    };

    // Parent likely calls a check function, but we can emit immediately or wait for "Check" button.
    // In Duolingo, you select then click Check. The definition of "Check" is usually at Container level.
    // So we need to expose the selected state or handle "Check" logic via ref/callback from parent.
    // For simplicity, let's just highlight here and let parent button trigger validation or we pass `selected` up.
    // Actually, LayoutContainer has the "Check" button.
    // So parent needs `selectedAnswer`.

    // We'll trust the parent to pass `submitted` status if we want to show red/green.
    // For now, let's keep it simple: simpler logic if we just visualize selection.

    return (
        <div className="w-full max-w-sm space-y-6">
            <h2 className="text-2xl font-bold text-center mb-8">{data.question}</h2>

            <div className="space-y-3">
                {data.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setSelected(index);
                            onAnswer(index === data.correctIndex);
                            // This might trigger immediate feedback if parent decides, 
                            // or just store the potential result.
                        }}
                        className={cn(
                            "w-full p-4 rounded-xl border-2 text-lg font-medium transition-all text-left hover:bg-muted/50",
                            selected === index
                                ? "border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400"
                                : "border-border"
                        )}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}
