import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { getAdminSession } from "@/lib/admin";
import { sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = getDb();

        // Manual migration queries
        const queries = [
            "ALTER TABLE scores ADD COLUMN hafalan REAL DEFAULT 0",
            "ALTER TABLE scores ADD COLUMN ujian_tulis REAL DEFAULT 0",
            "ALTER TABLE scores ADD COLUMN qiyamullail REAL DEFAULT 0",
            "ALTER TABLE scores ADD COLUMN monitoring REAL DEFAULT 0"
        ];

        const results = [];
        for (const query of queries) {
            try {
                // Using sql.raw for manual ALTER TABLE
                await (db as any).run(sql.raw(query));
                results.push({ query, status: "success" });
            } catch (e: any) {
                results.push({ query, status: "error", message: e.message });
            }
        }

        return NextResponse.json({
            message: "Migration completed",
            results
        });

    } catch (error: any) {
        console.error("Migration fatal error:", error);
        return NextResponse.json({ error: "Migration failed", message: error.message }, { status: 500 });
    }
}
