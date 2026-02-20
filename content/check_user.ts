
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
import * as schema from "../src/lib/server/db/schema";
import path from "path";
import { eq } from "drizzle-orm";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
}

const client = createClient({ url: process.env.DATABASE_URL });
const db = drizzle(client, { schema });

async function main() {
    console.log("Checking for admin user...");
    const u = await db.query.user.findFirst({
        where: eq(schema.user.email, "admin@satusaf.com")
    });

    console.log("User found:", u);

    if (u) {
        const a = await db.query.account.findFirst({
            where: eq(schema.account.userId, u.id)
        });
        console.log("Account found:", a);
    }
}

main();
