"use client";

import { useCallback } from "react";

type SoundEffect = 'correct' | 'incorrect' | 'levelup' | 'whoosh' | 'boing' | 'victory' | 'tap';

const SOUNDS: Record<SoundEffect, string> = {
    correct: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', // Pop/Achievement
    incorrect: 'https://assets.mixkit.co/active_storage/sfx/2330/2330-preview.mp3', // Error/Oops
    levelup: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3', // Bright chime
    whoosh: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Quick transition
    boing: 'https://assets.mixkit.co/active_storage/sfx/138/138-preview.mp3', // Cartoon bounce (for Falah appear)
    victory: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3', // Triumphant bells
    tap: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' // Crisp click
};

export function useSound() {
    const playSound = useCallback((effect: SoundEffect) => {
        const audio = new Audio(SOUNDS[effect]);
        audio.volume = 0.5;
        audio.play().catch(e => console.warn("Sound play failed:", e));
    }, []);

    return { playSound };
}
