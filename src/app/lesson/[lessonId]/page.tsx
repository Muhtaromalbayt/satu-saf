import LessonContainer from "@/components/lesson/LessonContainer";
import { MOCK_CHAPTERS } from "@/data/mockData";

export default async function LessonPage(props: { params: Promise<{ lessonId: string }> }) {
    const params = await props.params;
    // Mock data fetching
    const lessonId = decodeURIComponent(params.lessonId);
    const node = MOCK_CHAPTERS.flatMap(c => c.nodes).find(n => n.id === lessonId);

    if (!node) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold text-red-500 mb-2">Lesson Not Found</h1>
                <p className="text-muted-foreground">ID: {lessonId}</p>
                <p className="text-sm text-slate-400 mt-4">Make sure this ID exists in mockData.ts</p>
            </div>
        );
    }

    return (
        <LessonContainer lessonId={lessonId} type={node.type as any} />
    );
}
