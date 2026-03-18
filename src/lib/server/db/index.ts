import { drizzle as drizzleLibSql } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzleLibSql> | null = null;

export function getDb(databaseUrl?: string) {
    if (dbInstance) return dbInstance;

    let url = databaseUrl || process.env.DATABASE_URL;

    // In Edge runtime, we MUST have a DATABASE_URL (usually Turso or similar)
    // Local file-based SQLite won't work on Edge.
    const isEdge = process.env.NEXT_RUNTIME === 'edge';

    if (!url) {
        if (isEdge) {
            throw new Error("DATABASE_URL is required in Edge runtime.");
        }

        // Fallback for local development ONLY in Node.js runtime
        try {
            // Using dynamic require to avoid bundling 'fs' and 'path' in Edge/Browser
            const fs = require('fs');
            const path = require('path');
            const localPath = path.resolve(process.cwd(), 'local.db');

            if (fs.existsSync(localPath)) {
                console.warn("⚠️ DATABASE_URL is not set. Falling back to file:local.db for development.");
                url = 'file:local.db';
            }
        } catch (e) {
            // fs/path not available, move on
        }

        if (!url) {
            // Avoid crashing ONLY during the build phase. 
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

    const client = createClient({
        url,
        authToken: process.env.DATABASE_AUTH_TOKEN
    });
    dbInstance = drizzleLibSql(client, { schema });
    return dbInstance;
}

export type DrizzleClient = ReturnType<typeof getDb>;
