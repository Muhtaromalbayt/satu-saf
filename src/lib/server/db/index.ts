import { drizzle as drizzleLibSql } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzleLibSql> | null = null;

export function getDb(databaseUrl?: string) {
    if (dbInstance) return dbInstance;

    const url = databaseUrl || process.env.DATABASE_URL;

    if (!url) {
        // Avoid crashing during static analysis or build phase
        if (process.env.NODE_ENV === 'production' || process.env.NEXT_PHASE === 'phase-production-build') {
            console.warn("⚠️ DATABASE_URL is not set. Using a dummy connection for build/compatibility.");
            // Returning a dummy client that won't throw until actually called
            const client = createClient({ url: "https://dummy.db" });
            dbInstance = drizzleLibSql(client, { schema });
            return dbInstance;
        }
        throw new Error("No database configuration found. Set DATABASE_URL in .env");
    }

    const client = createClient({ url });
    dbInstance = drizzleLibSql(client, { schema });
    return dbInstance;
}

export type DrizzleClient = ReturnType<typeof getDb>;
