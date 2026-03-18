import fs from 'fs';
import path from 'path';
import { getDb } from '../lib/server/db';
import { user as userTable, scores as scoresTable } from '../lib/server/db/schema';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
    const csvPath = path.resolve(process.cwd(), 'Format Penilaian - Format.csv');
    if (!fs.existsSync(csvPath)) {
        console.error(`CSV file not found at ${csvPath}`);
        return;
    }

    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');

    const db = getDb();

    console.log(`Starting seed from ${csvPath}...`);

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

        const userId = uuidv4();

        try {
            // Check if user already exists to avoid duplicates
            // We'll use name + kelompok as a simple unique check for seeding
            // though in real app we might want more robust check

            console.log(`Processing: ${name} (Kelompok: ${kelompok}) - Score: ${score}`);

            await db.insert(userTable).values({
                id: userId,
                name: name,
                kelompok: kelompok,
                role: 'santri'
            }).onConflictDoNothing();

            // Since we use onConflictDoNothing, we need to find the user if they existed
            // but for simplicity in seeding new DB, we assume fresh state or unique UUIDs

            if (score > 0) {
                await db.insert(scoresTable).values({
                    userId: userId,
                    hafalanTotal: score,
                    hafalanCount: 1,
                    tesTulis: 0,
                    tahajudCount: 0
                }).onConflictDoNothing();
            }
        } catch (err) {
            console.error(`Error processing ${name}:`, err);
        }
    }

    console.log('Seeding process finished.');
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

seed().catch(err => {
    console.error('Fatal error during seeding:', err);
    process.exit(1);
});
