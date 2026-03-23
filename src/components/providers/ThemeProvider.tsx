"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
    isMidnight: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isMidnight, setIsMidnight] = useState(false);

    useEffect(() => {
        const checkMidnight = () => {
            const now = new Date();
            const hour = now.getHours();
            const minute = now.getMinutes();
            // Pagi: 06:00 - 18:00
            // Malam: 18:01 - 05:59
            const totalMinutes = hour * 60 + minute;
            const startNight = 18 * 60 + 1; // 18:01
            const endNight = 6 * 60;       // 06:00
            
            if (startNight <= endNight) {
                // This case won't happen with 18:01 to 06:00, but for generic range:
                setIsMidnight(totalMinutes >= startNight && totalMinutes < endNight);
            } else {
                // Night spans across midnight (18:01 to 05:59)
                setIsMidnight(totalMinutes >= startNight || totalMinutes < endNight);
            }
        };
        
        checkMidnight();
        // Check every minute
        const interval = setInterval(checkMidnight, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <ThemeContext.Provider value={{ isMidnight }}>
            <div className={isMidnight ? "dark-theme" : "light-theme"}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
