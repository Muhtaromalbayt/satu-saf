"use client";

import { useState } from "react";
import { Check, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistItem {
    id: string;
    label: string;
    description?: string;
}

interface ChecklistSlideProps {
    data: {
        title: string;
        items: ChecklistItem[];
    };
    onComplete: (data: any) => void;
}

export default function ChecklistSlide({ data, onComplete }: ChecklistSlideProps) {
    const [checkedItems, setCheckedItems] = useState<string[]>([]);

    const toggleItem = (id: string) => {
        setCheckedItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const isComplete = checkedItems.length === data.items.length;

    return (
        <div className="w-full max-w-sm space-y-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-primary text-center">{data.title}</h2>

            <div className="w-full space-y-3">
                {data.items.map((item) => {
                    const isChecked = checkedItems.includes(item.id);
                    return (
                        <button
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            className={cn(
                                "w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all text-left",
                                isChecked
                                    ? "bg-green-100 border-green-500 text-green-800"
                                    : "bg-white border-slate-200 hover:bg-slate-50"
                            )}
                        >
                            <div className={cn(
                                "h-6 w-6 rounded-md border-2 flex items-center justify-center transition-colors",
                                isChecked ? "bg-green-500 border-green-500 text-white" : "border-slate-300"
                            )}>
                                {isChecked && <Check className="h-4 w-4" />}
                            </div>
                            <div>
                                <p className="font-bold">{item.label}</p>
                                {item.description && <p className="text-xs opacity-70">{item.description}</p>}
                            </div>
                        </button>
                    );
                })}
            </div>

            <button
                onClick={() => onComplete({ checkedItems })}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
                <span>Selesai & Lanjut</span>
            </button>
        </div>
    );
}
