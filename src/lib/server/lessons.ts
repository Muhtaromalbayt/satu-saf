import { getDb } from "@/lib/server/db";
import { lessons as lessonsTable, progress as progressTable } from "@/lib/server/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { Chapter, LevelNodeData, Slide, NodeType } from "@/lib/types";

export async function getChapters(userId?: string): Promise<Chapter[]> {
    const db = getDb();

    // Fetch all lessons ordered by chapter and creation
    const allLessons = await db.select().from(lessonsTable).orderBy(asc(lessonsTable.chapter), asc(lessonsTable.createdAt));

    // Fetch user progress if userId is provided
    const userProgress = userId
        ? await db.select().from(progressTable).where(eq(progressTable.userId, userId))
        : [];

    const completedLessonIds = new Set(userProgress.map(p => p.lessonId));

    // Group by chapter
    const chaptersMap = new Map<number, LevelNodeData[]>();

    allLessons.forEach((lesson) => {
        const node: LevelNodeData = {
            id: lesson.id,
            type: lesson.type as NodeType,
            status: completedLessonIds.has(lesson.id) ? 'completed' : 'active',
            label: lesson.title || undefined
        };

        if (!chaptersMap.has(lesson.chapter)) {
            chaptersMap.set(lesson.chapter, []);
        }
        chaptersMap.get(lesson.chapter)?.push(node);
    });

    // Convert to Chapter array
    const chapters: Chapter[] = Array.from(chaptersMap.entries()).map(([chapterNum, nodes]) => {
        // Simple heuristic for chapter titles if not explicitly stored in a chapters table
        return {
            id: `ch-${chapterNum}`,
            title: `Chapter ${chapterNum}`,
            description: `Materi Pelajaran Bab ${chapterNum}`,
            nodes: nodes
        };
    });

    // Logic for locking chapters:
    // A chapter is unlocked if the previous chapter has at least one lesson completed (or is the first chapter)
    // For simplicity, let's just mark them all active for now and refine later if needed.

    return chapters;
}

export async function getLessonSlides(lessonId: string): Promise<Slide[]> {
    const db = getDb();
    const result = await db.select().from(lessonsTable).where(eq(lessonsTable.id, lessonId)).limit(1);

    if (result.length === 0) return [];

    const lesson = result[0];
    const content = JSON.parse(lesson.content || "{}");

    // Check for new 5-part structure
    if (content.preTest || content.material || content.amalan) {
        let slides: Slide[] = [];

        // 1. Pre-test
        if (content.preTest && Array.isArray(content.preTest)) {
            content.preTest.forEach((item: any, idx: number) => {
                const id = `${lesson.id}-pre-${idx}`;
                if (item.type === 'multiple_choice') {
                    slides.push({ id, type: 'quiz', content: item });
                } else if (item.type === 'pair_matching') {
                    slides.push({ id, type: 'pair_matching', content: item });
                } else if (item.type === 'sentence_arrange') {
                    slides.push({ id, type: 'sentence_arrange', content: item });
                }
            });
        }

        // 2. Material
        if (content.material) {
            // Support both single object and array
            const materials = Array.isArray(content.material) ? content.material : [content.material];
            materials.forEach((item: any, idx: number) => {
                slides.push({ id: `${lesson.id}-mat-${idx}`, type: 'material', content: item });
            });
        }

        // 3. Mastery Quiz
        if (content.quiz && Array.isArray(content.quiz)) {
            content.quiz.forEach((item: any, idx: number) => {
                const id = `${lesson.id}-quiz-${idx}`;
                if (item.type === 'sorting') {
                    slides.push({ id, type: 'sorting', content: item });
                } else {
                    slides.push({ id, type: 'quiz', content: item });
                }
            });
        }

        // 4. Amalan
        if (content.amalan) {
            slides.push({ id: `${lesson.id}-amalan`, type: 'amalan', content: content.amalan });
        }

        // 5. Tadarus / Tarteel
        if (content.tadarus) {
            slides.push({ id: `${lesson.id}-tarteel`, type: 'tarteel', content: content.tadarus });
        }

        // 6. Final Submission
        slides.push({
            id: `${lesson.id}-final`,
            type: 'final_submit',
            content: { lessonId: lesson.id }
        });

        return slides;
    }

    // Format based on type (Story slides, Quiz questions, etc.)
    if (lesson.type === 'story') {
        const slides = content.slides || [];
        return slides.map((s: any, idx: number) => ({
            id: `${lesson.id}-s-${idx}`,
            type: 'story',
            content: s
        }));
    }

    if (lesson.type === 'quiz') {
        const questions = content.questions || [];
        return questions.map((q: any, idx: number) => ({
            id: `${lesson.id}-q-${idx}`,
            type: 'quiz',
            content: q
        }));
    }

    if (lesson.type === 'recite') {
        return [{
            id: `${lesson.id}-r`,
            type: 'recite',
            content: content
        }];
    }

    if (lesson.type === 'action') {
        return [{
            id: `${lesson.id}-a`,
            type: 'action',
            content: {
                title: content.mission,
                description: content.challenge,
                points: content.points
            }
        }];
    }

    return [];
}
