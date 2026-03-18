"use client";

class SoundManager {
    private sounds: Record<string, HTMLAudioElement> = {};
    private bgm: HTMLAudioElement | null = null;
    private enabled: boolean = true;

    constructor() {
        if (typeof window !== "undefined") {
            // Pre-load common sounds using public URLs or placeholders
            // In a real app, these would be in /public/sounds/
            this.sounds = {
                click: new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3"),
                success: new Audio("https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3"),
                camera: new Audio("https://assets.mixkit.co/active_storage/sfx/523/523-preview.mp3"),
                open: new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"),
                close: new Audio("https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3"),
                select: new Audio("https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3"),
            };

            // Set volumes
            Object.values(this.sounds).forEach(s => s.volume = 0.5);

            this.bgm = new Audio("https://assets.mixkit.co/active_storage/sfx/123/123-preview.mp3"); // Replace with actual calm BGM
            if (this.bgm) {
                this.bgm.loop = true;
                this.bgm.volume = 0.2;
            }
        }
    }

    play(name: keyof typeof this.sounds) {
        if (!this.enabled || !this.sounds[name]) return;
        this.sounds[name].currentTime = 0;
        this.sounds[name].play().catch(() => { }); // Ignore autoplay blocks
    }

    startBGM() {
        if (!this.enabled || !this.bgm) return;
        this.bgm.play().catch(() => { });
    }

    stopBGM() {
        if (this.bgm) {
            this.bgm.pause();
        }
    }

    toggle(enabled: boolean) {
        this.enabled = enabled;
        if (!enabled) this.stopBGM();
    }
}

export const sounds = typeof window !== "undefined" ? new SoundManager() : null;
