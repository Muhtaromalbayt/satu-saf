import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { user as userTable, scores as scoresTable } from "@/lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const content = await file.text();
        const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');

        if (lines.length <= 1) {
            return NextResponse.json({ error: "CSV file is empty or missing data" }, { status: 400 });
        }

        const db = getDb();
        let processedCount = 0;
        let addedCount = 0;
        let updatedCount = 0;

        // Skip header (lines[0])
        for (let i = 1; i < lines.length; i++) {
            const row = parseCsvLine(lines[i]);
            if (row.length < 2) continue;

            const name = row[0].trim();
            const kelompok = row[1].trim();
            let totalSkorStr = row[6] || "0";

            // Handle "98,75" or #DIV/0! or empty
            if (totalSkorStr.includes('#DIV/0!') || totalSkorStr.trim() === '') {
                totalSkorStr = "0";
            }
            totalSkorStr = totalSkorStr.replace(/"/g, '').replace(',', '.');
            const score = parseFloat(totalSkorStr) || 0;

            if (!name || name === 'Nama') continue;

            processedCount++;

            // Find existing user by name and kelompok
            const existingUser = await db.select()
                .from(userTable)
                .where(and(
                    eq(userTable.name, name),
                    eq(userTable.kelompok, kelompok)
                ))
                .get();

            let userId = existingUser?.id;

            if (!existingUser) {
                // If user doesn't exist, create them
                userId = uuidv4();
                await db.insert(userTable).values({
                    id: userId,
                    name: name,
                    kelompok: kelompok,
                    role: 'santri'
                });
                addedCount++;
            }

            // Update or Insert score
            const existingScore = await db.select()
                .from(scoresTable)
                .where(eq(scoresTable.userId, userId!))
                .get();

            if (existingScore) {
                await db.update(scoresTable)
                    .set({
                        hafalanTotal: score, // Assuming Total Skor maps to hafalanTotal for now
                        updatedAt: new Date()
                    })
                    .where(eq(scoresTable.userId, userId!));
                updatedCount++;
            } else {
                await db.insert(scoresTable).values({
                    userId: userId!,
                    hafalanTotal: score,
                    hafalanCount: 1,
                    tesTulis: 0,
                    tahajudCount: 0
                });
                updatedCount++;
            }
        }

        return NextResponse.json({
            message: `Berhasil memproses ${processedCount} baris.`,
            details: {
                processed: processedCount,
                added: addedCount,
                updated: updatedCount
            }
        });

    } catch (error) {
        console.error("Import CSV error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

function parseCsvLine(line: string) {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}
