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
const SHEET_RANGE = "Sheet1!A:D"; // adjust if needed

export interface Participant {
    id: string;
    nama: string;
    kelompok: string;
    role: string; // 'santri' | 'mentor' | 'admin'
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
                const [_header, ...dataRows] = rows;

                sheetParticipants = dataRows.map((row) => ({
                    id: row[0] || "",
                    nama: row[1] || "",
                    kelompok: row[2] || "",
                    role: row[3] || "santri",
                })).filter(p => p.nama && p.kelompok);
            }
        } catch (err) {
            console.error("[sheets] Error fetching from Google Sheets:", err);
        }
    }

    // Merge and ensure uniqueness (priority to Sheets if ID matches, or just general merge)
    const combined = [...dbParticipants];
    sheetParticipants.forEach(sp => {
        const exists = combined.find(cp =>
            cp.nama.toLowerCase() === sp.nama.toLowerCase() &&
            cp.kelompok.toLowerCase() === sp.kelompok.toLowerCase()
        );
        if (!exists) {
            combined.push(sp);
        }
    });

    cache = { participants: combined, fetchedAt: Date.now() };
    return combined;
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
