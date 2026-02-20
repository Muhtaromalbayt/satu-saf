import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "@/lib/server/db";

export const auth = betterAuth({
    database: drizzleAdapter(getDb(), {
        provider: "sqlite",
    }),
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
