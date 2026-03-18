import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { systemSettings } from "@/lib/server/db/schema";
import { sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const db = getDb();

        // 1. Connection check
        const test = await db.select({ count: sql`count(*)` }).from(systemSettings).catch(e => ({ error: e.message }));

        // 2. Write check (Try to update a dummy setting or just check if read-only)
        const isReadOnly = await db.run(sql`PRAGMA query_only`).catch(() => null);

        return NextResponse.json({
            status: "ok",
            database: {
                url: process.env.DATABASE_URL ? "SET" : "NOT SET (using local.db)",
                testResult: test,
                pragma: isReadOnly
            },
            env: {
                NODE_ENV: process.env.NODE_ENV,
                VERCEL: process.env.VERCEL || "false"
            }
        });
    } catch (err: any) {
        return NextResponse.json({
            status: "error",
            error: err.message,
            stack: err.stack
        }, { status: 500 });
    }
}
