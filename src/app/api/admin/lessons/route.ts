import { getAdminSession } from "@/lib/admin";
import { getDb } from "@/lib/server/db";
import { lessons } from "@/lib/server/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = getDb();
        const allLessons = await db.select().from(lessons).orderBy(desc(lessons.chapter), lessons.id);

        return NextResponse.json(allLessons);
    } catch (error) {
        console.error("Admin lessons GET error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const { chapter, type, title, content } = data;

        if (!chapter || !type) {
            return NextResponse.json({ error: "Chapter and Type are required" }, { status: 400 });
        }

        const db = getDb();
        const id = uuidv4();

        await db.insert(lessons).values({
            id,
            chapter: Number(chapter),
            type,
            title: title || "",
            content: typeof content === 'string' ? content : JSON.stringify(content),
        });

        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error("Admin lessons POST error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
