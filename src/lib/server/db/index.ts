import { drizzle as drizzleLibSql } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzleLibSql> | null = null;

export function getDb(databaseUrl?: string) {
    if (dbInstance) return dbInstance;

    const url = databaseUrl || process.env.DATABASE_URL;

    if (!url) {
        throw new Error("No database configuration found. Set DATABASE_URL in .env");
    }

    const client = createClient({ url });
    dbInstance = drizzleLibSql(client, { schema });
    return dbInstance;
}

export type DrizzleClient = ReturnType<typeof getDb>;
