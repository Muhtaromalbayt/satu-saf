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
            const hour = new Date().getHours();
            // Midnight Mode: 18:00 (6 PM) to 05:00 (5 AM)
            setIsMidnight(hour >= 18 || hour < 5);
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
