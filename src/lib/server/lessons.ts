import { getDb } from "@/lib/server/db";
import { lessons as lessonsTable, progress as progressTable, matchingPool } from "@/lib/server/db/schema";
import { eq, and, asc, sql } from "drizzle-orm";
import { Chapter, LevelNodeData, Slide, NodeType } from "@/lib/types";
import { MOCK_CHAPTERS, LESSON_CONTENT } from "@/data/mockData";

export async function getChapters(userId?: string): Promise<Chapter[]> {
    const db = getDb();

    // Fetch all lessons ordered by chapter and creation
    const allLessons = await db.select().from(lessonsTable).orderBy(asc(lessonsTable.chapter), asc(lessonsTable.createdAt));

    // Fallback to mock data if DB is empty
    if (allLessons.length === 0) {
        return MOCK_CHAPTERS;
    }

    // Fetch user progress if userId is provided
    const userProgress = userId
        ? await db.select().from(progressTable).where(eq(progressTable.userId, userId))
        : [];

    const completedLessonIds = new Set(userProgress.map(p => p.lessonId));

    // Group by chapter
    const chaptersMap = new Map<number, LevelNodeData[]>();
    let nodes: LevelNodeData[] = [];

    allLessons.forEach((lesson) => {
        let content: any = {};
        try {
            content = JSON.parse(lesson.content || "{}");
        } catch (e) { }

        if (content.preTest || content.material || content.amalan || content.tadarus) {
            // New 5-part structure: Expand into multiple nodes
            const baseId = lesson.id;

            // 1. Pre-test
            if (content.preTest) {
                nodes.push({
                    id: `${baseId}-pretest`,
                    type: "quiz",
                    status: completedLessonIds.has(baseId) ? 'completed' : 'active',
                    label: "Pre-Test"
                });
            }

            // 2. Material
            if (content.material) {
                nodes.push({
                    id: `${baseId}-material`,
                    type: "story",
                    status: "locked",
                    label: "Materi"
                });
            }

            // 3. Quiz
            if (content.quiz) {
                nodes.push({
                    id: `${baseId}-quiz`,
                    type: "quiz",
                    status: "locked",
                    label: "Quiz"
                });
            }

            // 4. Amalan
            if (content.amalan) {
                nodes.push({
                    id: `${baseId}-amalan`,
                    type: "checklist",
                    status: "locked",
                    label: "Amalan"
                });
            }

            // 5. Tadarus
            if (content.tadarus) {
                nodes.push({
                    id: `${baseId}-tadarus`,
                    type: "recite",
                    status: "locked",
                    label: "Tadarus"
                });
            }
        } else {
            // Legacy/Simple structure: Single node
            nodes.push({
                id: lesson.id,
                type: lesson.type as NodeType,
                status: completedLessonIds.has(lesson.id) ? 'completed' : 'active',
                label: lesson.title || undefined
            });
        }

        if (!chaptersMap.has(lesson.chapter)) {
            chaptersMap.set(lesson.chapter, []);
        }
        chaptersMap.get(lesson.chapter)?.push(...nodes);

        // Reset nodes for next lesson
        nodes = [];
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

    // Handle sub-node IDs from the map (e.g., chapter-1-main-pretest)
    let searchId = lessonId;
    let targetSegment: string | null = null;

    if (lessonId.includes('-')) {
        const parts = lessonId.split('-');
        const lastPart = parts[parts.length - 1];
        if (['pretest', 'material', 'quiz', 'amalan', 'tadarus'].includes(lastPart)) {
            targetSegment = lastPart;
            searchId = parts.slice(0, -1).join('-');
        }
    }

    const result = await db.select().from(lessonsTable).where(eq(lessonsTable.id, searchId)).limit(1);

    let lesson: any = result[0];
    let content: any = {};

    // Fallback to mock data if DB is empty or lesson not found
    if (!lesson) {
        let mockSlides: Slide[] = [];
        if (LESSON_CONTENT[lessonId]) {
            mockSlides = [...LESSON_CONTENT[lessonId]];
        } else if (LESSON_CONTENT[`${searchId}-${targetSegment}`]) {
            mockSlides = [...LESSON_CONTENT[`${searchId}-${targetSegment}`]];
        }

        if (mockSlides.length > 0) {
            // Append final submit if not already present
            if (!mockSlides.find(s => s.type === 'final_submit')) {
                mockSlides.push({
                    id: `${lessonId}-final`,
                    type: 'final_submit',
                    content: { lessonId }
                });
            }
            return mockSlides;
        }
        return [];
    }

    try {
        content = JSON.parse(lesson.content || "{}");
    } catch (e) {
        console.error("Error parsing lesson content:", e);
        return [];
    }

    // Check for new 5-part structure
    if (content.preTest || content.material || content.amalan) {
        let slides: Slide[] = [];

        // 1. Pre-test
        if (content.preTest && Array.isArray(content.preTest)) {
            let idx = 0;
            for (const item of content.preTest) {
                const id = `${lesson.id}-pre-${idx++}`;
                if (item.type === 'multiple_choice') {
                    slides.push({ id, type: 'quiz', content: item });
                } else if (item.type === 'pair_matching') {
                    if (item.usePool) {
                        try {
                            const db = getDb();
                            const limit = item.limit || 20;
                            const poolItems = await db.select()
                                .from(matchingPool)
                                .where(item.category ? eq(matchingPool.category, item.category) : undefined)
                                .orderBy(sql`RANDOM()`)
                                .limit(limit);

                            if (poolItems.length > 0) {
                                item.pairs = poolItems.map(p => ({
                                    id: `pool-${p.id}`,
                                    left: p.left,
                                    right: p.right
                                }));
                            }
                        } catch (err) {
                            console.error("Error fetching from matching pool:", err);
                        }
                    }
                    slides.push({ id, type: 'pair_matching', content: item });
                } else if (item.type === 'sentence_arrange') {
                    slides.push({ id, type: 'sentence_arrange', content: item });
                }
            }
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

        // Filter slides based on target segment if specified
        let filteredSlides = slides;
        if (targetSegment) {
            if (targetSegment === 'pretest') {
                filteredSlides = slides.filter(s => s.id.includes('-pre-') || s.id.includes('-pretest'));
            } else if (targetSegment === 'material') {
                filteredSlides = slides.filter(s => s.id.includes('-mat-') || s.id.includes('-material'));
            } else if (targetSegment === 'quiz') {
                filteredSlides = slides.filter(s => s.id.includes('-quiz-'));
            } else if (targetSegment === 'amalan') {
                filteredSlides = slides.filter(s => s.id.includes('-amalan'));
            } else if (targetSegment === 'tadarus') {
                filteredSlides = slides.filter(s => s.id.includes('-tarteel') || s.id.includes('-tadarus'));
            }

            // Always ensure the final submit slide is at the end of the filtered segment
            const finalSlide = slides.find(s => s.type === 'final_submit');
            if (finalSlide && !filteredSlides.find(s => s.id === finalSlide.id)) {
                filteredSlides.push(finalSlide);
            }
        }

        return filteredSlides;
    }

    // Format based on type (Story slides, Quiz questions, etc.)
    let slides: Slide[] = [];
    if (lesson.type === 'story') {
        const storySlides = content.slides || [];
        slides = storySlides.map((s: any, idx: number) => ({
            id: `${lesson.id}-s-${idx}`,
            type: 'story',
            content: s
        }));
    } else if (lesson.type === 'quiz') {
        const questions = content.questions || [];
        slides = questions.map((q: any, idx: number) => ({
            id: `${lesson.id}-q-${idx}`,
            type: 'quiz',
            content: q
        }));
    } else if (lesson.type === 'recite') {
        slides = [{
            id: `${lesson.id}-r`,
            type: 'recite',
            content: content
        }];
    } else if (lesson.type === 'action') {
        slides = [{
            id: `${lesson.id}-a`,
            type: 'action',
            content: {
                title: content.mission,
                description: content.challenge,
                points: content.points
            }
        }];
    }

    if (slides.length > 0) {
        slides.push({
            id: `${lesson.id}-final`,
            type: 'final_submit',
            content: { lessonId: lesson.id }
        });
    }

    return slides;
}
