import LessonContainer from "@/components/lesson/LessonContainer";
import { notFound } from "next/navigation";
import { getLessonSlides } from "@/lib/server/lessons";
import { getDb } from "@/lib/server/db";
import { lessons as lessonsTable } from "@/lib/server/db/schema";
import { eq } from "drizzle-orm";

// Opsional: Memastikan data selalu fresh
export const revalidate = 0;

export default async function LessonPage(props: { params: Promise<{ lessonId: string }> }) {
    const params = await props.params;
    const lessonId = decodeURIComponent(params.lessonId);

    // Fetch lesson basic info from DB
    const db = getDb();
    const lessonResult = await db.select().from(lessonsTable).where(eq(lessonsTable.id, lessonId)).limit(1);

    if (lessonResult.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-cream">
                <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-slate-100">
                    <h1 className="text-3xl font-bold text-red-500 mb-2">Aduh! Materi Hilang</h1>
                    <p className="text-slate-600 mb-4">ID Pelajaran: <span className="font-mono bg-slate-100 px-2 py-1 rounded">{lessonId}</span></p>
                    <p className="text-sm text-slate-400">
                        Pastikan ID ini terdaftar di database D1 lewat dashboard admin.
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

    const lesson = lessonResult[0];
    const slides = await getLessonSlides(lessonId);

    return (
        <main className="min-h-screen bg-white">
            <LessonContainer
                lessonId={lessonId}
                type={lesson.type as any}
                initialSlides={slides}
            />
        </main>
    );
}