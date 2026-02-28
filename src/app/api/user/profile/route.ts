import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/lib/server/db";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const { role, name, grade, gender, mosque, parentEmail } = data;

        const db = getDb();
        const { user } = await import("@/lib/server/db/schema");
        const { eq } = await import("drizzle-orm");

        // If parentEmail is provided, find the parent user
        let parentId = null;
        if (parentEmail && role === 'student') {
            const parentUser = await db.select().from(user).where(eq(user.email, parentEmail)).get();
            if (parentUser && parentUser.role === 'parent') {
                parentId = parentUser.id;
            }
        }

        await db.update(user)
            .set({
                role: role || 'santri',
                name,
                grade,
                gender,
                mosque,
                parentId: parentId || undefined,
                updatedAt: new Date()
            })
            .where(eq(user.id, session.user.id));

        return NextResponse.json({ success: true, parentFound: !!parentId });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
