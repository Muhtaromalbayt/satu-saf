import { NextRequest, NextResponse } from "next/server";
import { fetchParticipants } from "@/lib/server/sheets";

/**
 * GET /api/sheets/participants
 * Returns the list of participants (nama + kelompok) from Google Sheets.
 * Used to populate login dropdowns.
 */
export async function GET(_req: NextRequest) {
    try {
        const participants = await fetchParticipants();
        // Return only what the client needs (no sheet row IDs exposed)
        const data = participants.map(p => ({
            nama: p.nama,
            kelompok: p.kelompok,
            role: p.role,
        }));
        return NextResponse.json({ participants: data });
    } catch (err) {
        console.error("[/api/sheets/participants]", err);
        return NextResponse.json({ error: "Gagal mengambil data peserta" }, { status: 500 });
    }
}
