import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { user as userTable, scores as scoresTable, systemSettings } from "@/lib/server/db/schema";
import { eq, and, inArray } from "drizzle-orm";
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

        // Load Scoring Weights
        let scoringWeight = {
            hafalan: 15,
            ujianTulis: 15,
            qiyamullail: 20,
            monitoring: 50
        };
        try {
            const settings = await db.select()
                .from(systemSettings)
                .where(eq(systemSettings.key, "scoring_weight"))
                .get();
            if (settings) scoringWeight = JSON.parse(settings.value);
        } catch (e) {}

        // Skip top 2 header rows
        for (let i = 2; i < lines.length; i++) {
            const row = parseCsvLine(lines[i]);
            if (row.length < 2) continue;

            const name = row[0].trim();
            const kelompok = row[1].trim();

            // Map specifically:
            // row[2] = Hafalan
            // row[3] = Ujian Tulis
            // row[4] = Qiyamullail

            const parseVal = (val: string) => {
                if (!val || val.includes('#DIV/0!') || val.trim() === '') return 0;
                return parseFloat(val.replace(/"/g, '').replace(',', '.')) || 0;
            };

            const hafalan = parseVal(row[2]);
            const ujianTulis = parseVal(row[3]);
            const qiyamullail = parseVal(row[4]);

            if (!name || name === 'Nama' || name === '') continue;

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
                const totalScore = Math.round(
                    (hafalan * (scoringWeight.hafalan / 100)) +
                    (ujianTulis * (scoringWeight.ujianTulis / 100)) +
                    (qiyamullail * (scoringWeight.qiyamullail / 100)) +
                    ((existingScore.monitoring || 0) * (scoringWeight.monitoring / 100))
                );

                await db.update(scoresTable)
                    .set({
                        hafalan,
                        ujianTulis,
                        qiyamullail,
                        totalScore,
                        updatedAt: new Date()
                    })
                    .where(eq(scoresTable.userId, userId!));
                updatedCount++;
            } else {
                const totalScore = Math.round(
                    (hafalan * (scoringWeight.hafalan / 100)) +
                    (ujianTulis * (scoringWeight.ujianTulis / 100)) +
                    (qiyamullail * (scoringWeight.qiyamullail / 100))
                );

                await db.insert(scoresTable).values({
                    userId: userId!,
                    hafalan,
                    ujianTulis,
                    qiyamullail,
                    totalScore
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
