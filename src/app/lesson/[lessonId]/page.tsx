// runtime removed for diagnostic

import LessonContainer from "@/components/lesson/LessonContainer";
import { MOCK_CHAPTERS } from "@/data/mockData";
import { notFound } from "next/navigation";

// Opsional: Memastikan data selalu fresh
export const revalidate = 0;

export default async function LessonPage(props: { params: Promise<{ lessonId: string }> }) {
    const params = await props.params;

    // Decode ID (penting jika ID mengandung karakter khusus atau spasi)
    const lessonId = decodeURIComponent(params.lessonId);

    // Mencari data node dari mockData
    const node = MOCK_CHAPTERS.flatMap(c => c.nodes).find(n => n.id === lessonId);

    // Jika node tidak ditemukan, gunakan fungsi notFound() bawaan Next.js
    if (!node) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-cream">
                <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-slate-100">
                    <h1 className="text-3xl font-bold text-red-500 mb-2">Aduh! Materi Hilang</h1>
                    <p className="text-slate-600 mb-4">ID Pelajaran: <span className="font-mono bg-slate-100 px-2 py-1 rounded">{lessonId}</span></p>
                    <p className="text-sm text-slate-400">
                        Pastikan ID ini terdaftar di <code className="text-pink-500">mockData.ts</code> atau database D1.
                    </p>
                    <a
                        href="/map"
                        className="mt-6 inline-block px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                    >
                        Kembali ke Peta
                    </a>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white">
            {/* LessonContainer akan menangani logika:
                - Story (Materi)
                - Quiz (Pilihan Ganda)
                - Recite (Suara)
                - Action (Amalan Yaumi)
            */}
            <LessonContainer
                lessonId={lessonId}
                type={node.type as "story" | "quiz" | "recite" | "action"}
                initialData={node} // Kirim data awal agar tidak perlu fetch ulang di client
            />
        </main>
    );
}