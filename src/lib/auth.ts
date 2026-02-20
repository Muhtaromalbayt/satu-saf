import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "@/lib/server/db";

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' || process.env.CI;

export const auth = betterAuth({
    database: drizzleAdapter(getDb(), {
        provider: "sqlite",
    }),
    baseURL: process.env.BETTER_AUTH_URL || (isBuildPhase ? "https://dummy.com" : process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : undefined),
    secret: process.env.BETTER_AUTH_SECRET || (isBuildPhase ? "dummy-secret-only-for-build-phase-12345678" : undefined),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "santri",
            },
            gender: {
                type: "string",
            },
            grade: {
                type: "string",
            },
            mosque: {
                type: "string",
            },
        },
    },
});
