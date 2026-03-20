"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
    id: string;
    name: string;
    email?: string;
    kelompok: string;
    role: string;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = async () => {
        try {
            const res = await fetch('/api/user/me');
            const data = await res.json();
            setUser(data.user || null);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const signOut = async () => {
        await fetch('/api/auth/sheets-login', { method: 'DELETE' });
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut, refresh }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
