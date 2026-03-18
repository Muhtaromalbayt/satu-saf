import { fetchParticipants } from "../lib/server/sheets";
import { getDb } from "../lib/server/db";
import { user as userTable, scores as scoresTable } from "../lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import * as dotenv from "dotenv";
import path from "path";
import { randomUUID } from "node:crypto";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function sync() {
    console.log("Starting Spreadsheet Sync...");

    // 1. Fetch from Sheets
    const participants = await fetchParticipants();
    const db = getDb();

    console.log(`Found ${participants.length} participants in Spreadsheet.`);

    let createdCount = 0;
    let updatedCount = 0;

    for (const p of participants) {
        if (!p.nama || !p.kelompok) {
            console.log(`Skipping row: Missing name or group.`, p);
            continue;
        }

        try {
            // 2. Find or Create User
            let dbUser = await db.select().from(userTable).where(
                and(
                    eq(userTable.name, p.nama),
                    eq(userTable.kelompok, p.kelompok)
                )
            ).limit(1);

            let userId: string;

            if (dbUser.length === 0) {
                userId = randomUUID();
                await db.insert(userTable).values({
                    id: userId,
                    name: p.nama,
                    kelompok: p.kelompok,
                    sheetRowId: p.id,
                    role: p.role as any || 'santri'
                });
                createdCount++;
            } else {
                userId = dbUser[0].id;
                // Update sheetRowId if missing
                if (!dbUser[0].sheetRowId) {
                    await db.update(userTable).set({ sheetRowId: p.id }).where(eq(userTable.id, userId));
                }
            }

            // 3. Update Score
            if (p.score !== undefined) {
                const existingScore = await db.select().from(scoresTable).where(eq(scoresTable.userId, userId)).limit(1);

                if (existingScore.length === 0) {
                    await db.insert(scoresTable).values({
                        userId: userId,
                        hafalanTotal: p.score,
                        hafalanCount: 1,
                        tesTulis: 0,
                        tahajudCount: 0
                    });
                } else {
                    // Update score if it's different
                    if (existingScore[0].hafalanTotal !== p.score) {
                        await db.update(scoresTable).set({
                            hafalanTotal: p.score,
                            hafalanCount: 1 // Reset or set to 1 for sync
                        }).where(eq(scoresTable.userId, userId));
                    }
                }
                updatedCount++;
            }
        } catch (err) {
            console.error(`Error syncing ${p.nama}:`, err);
        }
    }

    console.log(`Sync Finished!`);
    console.log(`Users Created: ${createdCount}`);
    console.log(`Scores Updated: ${updatedCount}`);
}

sync().catch(err => {
    console.error("Fatal sync error:", err);
    process.exit(1);
});
