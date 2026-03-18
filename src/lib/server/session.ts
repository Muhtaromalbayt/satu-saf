import crypto from "node:crypto";
/**
 * Simple manual session manager using random tokens stored in D1.
 * Replaces BetterAuth for the passwordless Sheets-based login.
 */

import { getDb } from "@/lib/server/db";
import { session, user } from "@/lib/server/db/schema";
import { eq, lt } from "drizzle-orm";
import { cookies } from "next/headers";

const SESSION_COOKIE = "saf_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function generateToken(): string {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function createSession(userId: string, ipAddress?: string, userAgent?: string) {
    const db = getDb();
    const token = generateToken();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    const id = generateToken();

    await db.insert(session).values({
        id,
        userId,
        token,
        expiresAt,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
    });

    return { token, expiresAt };
}

export async function getSessionUser(token: string) {
    const db = getDb();

    const result = await db
        .select({ session, user })
        .from(session)
        .innerJoin(user, eq(session.userId, user.id))
        .where(eq(session.token, token))
        .limit(1);

    if (!result || result.length === 0) return null;

    const { session: s, user: u } = result[0];

    if (new Date() > s.expiresAt) {
        await db.delete(session).where(eq(session.token, token));
        return null;
    }

    return u;
}

export async function deleteSession(token: string) {
    const db = getDb();
    await db.delete(session).where(eq(session.token, token));
}

export async function deleteUserSessions(userId: string) {
    const db = getDb();
    await db.delete(session).where(eq(session.userId, userId));
}

/** Call this in server components or route handlers to get active user */
export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return getSessionUser(token);
}

export { SESSION_COOKIE };
