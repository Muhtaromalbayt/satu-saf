"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface GamificationState {
    hearts: number;
    xp: number;
    streak: number;
    completedNodes: string[];
    chapterStatus: Record<string, 'pending' | 'submitted' | 'approved'>;
    tadarusCount: number;
    decrementHearts: () => void;
    addXp: (amount: number) => void;
    restoreHearts: () => void;
    completeNode: (nodeId: string) => void;
    submitChapter: (chapterId: string) => void;
    addOneHeart: () => void;
    incrementTadarus: () => void;
}

const GamificationContext = createContext<GamificationState | undefined>(undefined);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
    const [hearts, setHearts] = useState(5);
    const [xp, setXp] = useState(0);
    const [streak, setStreak] = useState(0);
    const [completedNodes, setCompletedNodes] = useState<string[]>([]);
    const [chapterStatus, setChapterStatus] = useState<Record<string, 'pending' | 'submitted' | 'approved'>>({});
    const [tadarusCount, setTadarusCount] = useState(0);

    // Load from local storage on mount
    useEffect(() => {
        const savedHearts = localStorage.getItem("hearts");
        const savedXp = localStorage.getItem("xp");
        const savedStreak = localStorage.getItem("streak");
        const savedNodes = localStorage.getItem("completedNodes");
        const savedChapterStatus = localStorage.getItem("chapterStatus");
        const savedTadarus = localStorage.getItem("tadarusCount");

        if (savedHearts) setHearts(parseInt(savedHearts));
        if (savedXp) setXp(parseInt(savedXp));
        if (savedStreak) setStreak(parseInt(savedStreak));
        if (savedNodes) setCompletedNodes(JSON.parse(savedNodes));
        if (savedChapterStatus) setChapterStatus(JSON.parse(savedChapterStatus));
        if (savedTadarus) setTadarusCount(parseInt(savedTadarus));
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem("hearts", hearts.toString());
        localStorage.setItem("xp", xp.toString());
        localStorage.setItem("streak", streak.toString());
        localStorage.setItem("completedNodes", JSON.stringify(completedNodes));
        localStorage.setItem("chapterStatus", JSON.stringify(chapterStatus));
        localStorage.setItem("tadarusCount", tadarusCount.toString());
    }, [hearts, xp, streak, completedNodes, chapterStatus, tadarusCount]);

    const decrementHearts = () => {
        setHearts((prev) => Math.max(0, prev - 1));
    };

    const addXp = (amount: number) => {
        setXp((prev) => prev + amount);
    };

    const restoreHearts = () => {
        setHearts(5);
    };

    const addOneHeart = () => {
        setHearts(prev => Math.min(5, prev + 1));
    };

    const incrementTadarus = () => {
        setTadarusCount(prev => prev + 1);
        addXp(10); // Bonus XP for Tadarus
    };

    const completeNode = (nodeId: string) => {
        if (!completedNodes.includes(nodeId)) {
            setCompletedNodes(prev => [...prev, nodeId]);
        }
    };

    const submitChapter = (chapterId: string) => {
        setChapterStatus(prev => ({
            ...prev,
            [chapterId]: 'submitted'
        }));
    };

    return (
        <GamificationContext.Provider value={{
            hearts, xp, streak, completedNodes, chapterStatus, tadarusCount,
            decrementHearts, addXp, restoreHearts,
            completeNode, submitChapter, addOneHeart, incrementTadarus
        }}>
            {children}
        </GamificationContext.Provider>
    );
}

export function useGamification() {
    const context = useContext(GamificationContext);
    if (context === undefined) {
        throw new Error("useGamification must be used within a GamificationProvider");
    }
    return context;
}
