"use client";

import React, { createContext, useContext } from 'react';
import { authClient } from '@/lib/auth-client';

type User = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    role?: string;
    createdAt: Date;
    updatedAt: Date;
};

type Session = {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
};

type AuthContextType = {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const {
        data: sessionData,
        isPending: loading,
    } = authClient.useSession();

    const user = sessionData?.user as User | null ?? null;
    const session = sessionData?.session as Session | null ?? null;

    const signOut = async () => {
        await authClient.signOut();
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signOut }}>
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
