"use client";

import { motion } from "framer-motion";

interface StorySlideProps {
    data: {
        title?: string;
        text: string;
        image?: string;
    }
}

export default function StorySlide({ data }: StorySlideProps) {
    return (
        <div className="flex flex-col items-center text-center space-y-6 max-w-sm">
            {data.image && (
                <div className="w-full aspect-video bg-muted rounded-xl mb-4 relative overflow-hidden">
                    {/* Placeholder for Image */}
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-gray-200 dark:bg-gray-800">
                        Image: {data.image}
                    </div>
                </div>
            )}

            {data.title && (
                <h2 className="text-3xl font-bold text-primary">{data.title}</h2>
            )}

            <p className="text-xl leading-relaxed text-muted-foreground">
                {data.text}
            </p>
        </div>
    );
}
