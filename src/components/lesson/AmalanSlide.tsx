"use client";

import AmalanTracker from "./AmalanTracker";

interface AmalanSlideProps {
    data: any;
    onComplete: (data: any) => void;
}

export default function AmalanSlide({ data, onComplete }: AmalanSlideProps) {
    return (
        <div className="flex flex-col h-full w-full">
            <AmalanTracker items={data?.items} onComplete={onComplete} />
        </div>
    );
}
