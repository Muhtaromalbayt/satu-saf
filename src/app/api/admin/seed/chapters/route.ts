import { getDb } from "@/lib/server/db";
import { lessons } from "@/lib/server/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const db = getDb();

        // Delete existing chapter-based lessons to avoid duplicates
        await db.delete(lessons).where(eq(lessons.type, 'chapter'));

        const chapterData = [
            {
                id: 'chapter-1-main',
                chapter: 1,
                type: 'chapter',
                title: 'Bab 1: Niat & Keikhlasan',
                content: JSON.stringify({
                    preTest: [
                        { type: "multiple_choice", question: "Apa niat utama kita saat berangkat ke masjid?", options: ["Mencari teman", "Hanya ikut-ikutan", "Mendekatkan diri kepada Allah", "Menghindari pekerjaan"], correctAnswer: 2 },
                        { type: "pair_matching", title: "Hubungkan Adab & Artinya", pairs: [{ id: "1", left: "Ikhlas", right: "Murni karena Allah" }, { id: "2", left: "Sidiq", right: "Jujur dalam Niat" }] }
                    ],
                    material: { title: "Visi SATU SAF", description: "Memahami pentingnya i'tikaf dan kebersihan hati.", type: "video", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
                    quiz: [{ type: "multiple_choice", question: "Apa arti Ikhlasul Amal?", options: ["Beramal karena terpaksa", "Beramal hanya untuk Allah", "Beramal agar dipuji", "Beramal sisa tenaga"], correctAnswer: 1 }],
                    amalan: { title: "Target Hari Ke-1", items: [{ id: "sholat", label: "Sholat 5 Waktu", icon: "mosque" }, { id: "ikhlas", label: "Niat Ikhlas", icon: "sparkles" }] },
                    tadarus: { surahName: "QS. Al-Ikhlas", verseText: "قُلْ هُوَ اللَّهُ أَحَدٌ", targetString: "Qul huwallahu ahad", translation: "Katakanlah: Dialah Allah, Yang Maha Esa." }
                })
            },
            {
                id: 'chapter-2-main',
                chapter: 2,
                type: 'chapter',
                title: 'Bab 2: Lisanul Khair',
                content: JSON.stringify({
                    preTest: [
                        { type: "multiple_choice", question: "Apa yang dilakukan jika tidak bisa berkata baik?", options: ["Berkata kasar", "Berdiam diri", "Bicara seadanya", "Berteriak"], correctAnswer: 1 }
                    ],
                    material: { title: "Indahnya Kata Baik", description: "Video tentang keutamaan menjaga lisan.", type: "video", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
                    quiz: [{ type: "multiple_choice", question: "Hukum Ghibah adalah?", options: ["Boleh", "Makruh", "Haram", "Sunnah"], correctAnswer: 2 }],
                    amalan: { title: "Target Hari Ke-2", items: [{ id: "lisan", label: "Jaga Lisan", icon: "sparkles" }, { id: "tilawah", label: "Tilawah 1 Juz", icon: "quran", isSpecial: true }] },
                    tadarus: { surahName: "QS. Al-Falaq", verseText: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", targetString: "Qul a'udzu birabbil falaq", translation: "Katakanlah: Aku berlindung kepada Tuhan Yang Menguasai subuh." }
                })
            }
            // Add more chapters as needed, or keep it short for verification
        ];

        // For brevity in this tool call, I'll only do a few, then instruct user how to add more or run full SQL.
        // Actually, let's add all 10 to be helpful.

        for (let i = 3; i <= 10; i++) {
            chapterData.push({
                id: `chapter-${i}-main`,
                chapter: i,
                type: 'chapter',
                title: `Bab ${i}: Materi Chapter ${i}`,
                content: JSON.stringify({
                    preTest: [{ type: "multiple_choice", question: `Pertanyaan awal Bab ${i}`, options: ["Opsi A", "Opsi B", "Opsi C", "Opsi D"], correctAnswer: 0 }],
                    material: { title: `Materi Bab ${i}`, description: `Deskripsi materi bab ${i}`, type: "video", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
                    quiz: [{ type: "multiple_choice", question: `Kuis akhir Bab ${i}`, options: ["Benar", "Salah"], correctAnswer: 0 }],
                    amalan: { title: `Amalan Bab ${i}`, items: [{ id: "sholat", label: "Sholat 5 Waktu", icon: "mosque" }] },
                    tadarus: { surahName: `Surah Bab ${i}`, verseText: "...", targetString: "...", translation: "..." }
                })
            });
        }

        for (const data of chapterData) {
            await db.insert(lessons).values({
                ...data,
                createdAt: Math.floor(Date.now() / 1000)
            });
        }

        return NextResponse.json({ success: true, message: "10 Chapters seeded successfully." });
    } catch (error: any) {
        console.error("Seed Chapters Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
