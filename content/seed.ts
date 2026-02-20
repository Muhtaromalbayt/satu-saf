import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as dotenv from "dotenv";
import * as schema from "../src/lib/server/db/schema";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
}

const client = createClient({ url: process.env.DATABASE_URL });
const db = drizzle(client, { schema });

const auth = betterAuth({
    database: drizzleAdapter(db, {
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

async function main() {
    console.log("Seeding admin user...");

    // Create a user directly using internal API if possible, or simulate sign up
    // Since we are server-side, we can use the API
    try {
        const email = "admin@satusaf.com";
        const password = "adminpassword123";
        const name = "Super Admin";

        const user = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name,
                role: "admin",
                gender: "Laki-laki",
                grade: "Admin",
                mosque: "Al-Azhar",
            }
        });

        console.log("Admin created successfully!");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
    } catch (e) {
        console.error("Failed to create admin:", e);
    }
}

main();
