/**
 * Google Sheets helper - fetches participant data from a public/shared Sheet
 * Sheet ID: 1RmQaicVsMyie50lHpQPb68pVVmrYBr9jlJuJ5-0T2TY
 *
 * Expected sheet format (row 1 = header):
 * | id | nama | kelompok | role |
 */
import { getDb } from "./db";
import { user as userTable } from "./db/schema";

const SHEET_ID = "1RmQaicVsMyie50lHpQPb68pVVmrYBr9jlJuJ5-0T2TY";
const SHEET_RANGE = "Sheet1!A:V"; // Increased range to capture columns O, P (15, 16) and U (21)

export interface Participant {
    id: string;
    nama: string;
    kelompok: string;
    role: string; // 'santri' | 'mentor' | 'admin'
    score?: number;
}

// Cache to avoid hammering Sheets API
let cache: { participants: Participant[]; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function fetchParticipants(): Promise<Participant[]> {
    if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
        return cache.participants;
    }

    const db = getDb();
    const dbUsers = await db.select().from(userTable);
    const dbParticipants: Participant[] = dbUsers.map((u: any) => ({
        id: u.sheetRowId || u.id,
        nama: u.name,
        kelompok: u.kelompok,
        role: u.role || 'santri'
    }));

    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    let sheetParticipants: Participant[] = [];

    if (apiKey) {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(
            SHEET_RANGE
        )}?key=${apiKey}`;

        try {
            const res = await fetch(url, { next: { revalidate: 300 } });
            if (res.ok) {
                const json = await res.json();
                const rows: string[][] = json.values || [];

                // From our analysis:
                // Column 15 (Index 14): Nama
                // Column 16 (Index 15): Kelompok
                // Column 21 (Index 20): Total Skor (e.g., "98,75")

                sheetParticipants = rows.map((row, index) => {
                    const nama = row[14];
                    const kelompok = row[15];
                    const scoreStr = row[20] || "0";

                    if (!nama || !kelompok || nama === "Nama") return null;

                    return {
                        id: `sheet-${index}`, // Synthetic ID based on row
                        nama: nama.trim(),
                        kelompok: kelompok.trim(),
                        role: "santri",
                        score: parseFloat(scoreStr.replace(',', '.')) || 0
                    };
                }).filter((p): p is Participant => p !== null);
            }
        } catch (err) {
            console.error("[sheets] Error fetching from Google Sheets API:", err);
        }
    }

    // Fallback if API key missing or failed
    if (sheetParticipants.length === 0) {
        try {
            const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;
            const res = await fetch(csvUrl);
            if (res.ok) {
                const csvData = await res.text();
                // Improved CSV parse that handles empty fields correctly
                const rows = csvData.split('\n').map(line => {
                    const row: string[] = [];
                    let cur = "";
                    let inQuotes = false;
                    for (let i = 0; i < line.length; i++) {
                        const char = line[i];
                        if (char === '"') inQuotes = !inQuotes;
                        else if (char === ',' && !inQuotes) {
                            row.push(cur);
                            cur = "";
                        } else {
                            cur += char;
                        }
                    }
                    row.push(cur);
                    return row;
                });

                sheetParticipants = mapRowsToParticipants(rows);
            }
        } catch (err) {
            console.error("[sheets] Error fetching from Google Sheets CSV fallback:", err);
        }
    }

    // Merge and ensure uniqueness (priority to Sheets for data like scores)
    const combined = [...dbParticipants];
    sheetParticipants.forEach(sp => {
        const existingIdx = combined.findIndex(cp =>
            cp.nama.toLowerCase() === sp.nama.toLowerCase() &&
            cp.kelompok.toLowerCase() === sp.kelompok.toLowerCase()
        );
        if (existingIdx > -1) {
            // Update existing DB entry with Sheet-specific data
            combined[existingIdx].score = sp.score;
            combined[existingIdx].id = sp.id;
        } else {
            combined.push(sp);
        }
    });

    cache = { participants: combined, fetchedAt: Date.now() };
    return combined;
}

/** Helper to map raw rows to Participant objects based on discovered layout */
function mapRowsToParticipants(rows: string[][]): Participant[] {
    return rows.map((row, index) => {
        // Based on analysis:
        // Index 0: Nama
        // Index 1: Kelompok
        // Index 6: Total Skor (e.g., "98,75")

        let nameIdx = 0;
        let kelompokIdx = 1;
        let scoreIdx = 6;

        // Skip header
        if (index === 0) return null;

        const nama = row[nameIdx];
        const kelompok = row[kelompokIdx];
        const scoreStr = row[scoreIdx] || "0";

        if (!nama || !kelompok || nama === "Nama" || nama.trim() === "") return null;

        return {
            id: `sheet-${index}`,
            nama: nama.trim().replace(/^"|"$/g, ''),
            kelompok: kelompok.trim().replace(/^"|"$/g, ''),
            role: "santri",
            score: parseFloat(scoreStr.replace(/"/g, '').replace(',', '.')) || 0
        };
    }).filter((p): p is Participant => p !== null);
}

export async function findParticipant(nama: string, kelompok: string): Promise<Participant | null> {
    const participants = await fetchParticipants();
    return (
        participants.find(
            (p) =>
                p.nama.trim().toLowerCase() === nama.trim().toLowerCase() &&
                p.kelompok.trim().toLowerCase() === kelompok.trim().toLowerCase()
        ) || null
    );
}

export async function findParticipantByName(nama: string): Promise<Participant | null> {
    const participants = await fetchParticipants();
    return (
        participants.find(
            (p) =>
                p.nama.trim().toLowerCase() === nama.trim().toLowerCase() &&
                p.role === "santri"
        ) || null
    );
}

export async function findMentorByKelompok(kelompok: string): Promise<Participant | null> {
    const participants = await fetchParticipants();
    return (
        participants.find(
            (p) =>
                p.role === "mentor" &&
                p.kelompok.trim().toLowerCase() === kelompok.trim().toLowerCase()
        ) || null
    );
}
