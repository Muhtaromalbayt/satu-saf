import fs from 'fs';
import path from 'path';
import { drizzle as drizzleLibSql } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzleLibSql> | null = null;

export function getDb(databaseUrl?: string) {
    if (dbInstance) return dbInstance;

    let url = databaseUrl || process.env.DATABASE_URL;

    if (!url) {
        // Fallback for local development if local.db exists
        const localPath = path.resolve(process.cwd(), 'local.db');
        if (fs.existsSync(localPath)) {
            console.warn("⚠️ DATABASE_URL is not set. Falling back to file:local.db for development.");
            url = 'file:local.db';
        } else {
            // Avoid crashing ONLY during the build phase. 
            // At runtime, we WANT it to throw if the DB is missing so we can see the error.
            const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' || process.env.CI;

            if (isBuildPhase) {
                console.warn("⚠️ DATABASE_URL is not set. Using a dummy connection for build/compatibility.");
                const client = createClient({ url: "https://dummy.db" });
                dbInstance = drizzleLibSql(client, { schema });
                return dbInstance;
            }
            throw new Error("No database configuration found. Please set DATABASE_URL in your environment variables.");
        }
    }

    const client = createClient({ url });
    dbInstance = drizzleLibSql(client, { schema });
    return dbInstance;
}

export type DrizzleClient = ReturnType<typeof getDb>;
