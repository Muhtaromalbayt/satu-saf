"use client";

import AmalanTracker from "./AmalanTracker";

interface AmalanSlideProps {
    data: any;
    onComplete: (data: any) => void;
}

export default function AmalanSlide({ onComplete }: AmalanSlideProps) {
    return (
        <div className="flex flex-col h-full w-full">
            <AmalanTracker onComplete={onComplete} />
        </div>
    );
}
