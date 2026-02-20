import { getAdminSession } from "@/lib/admin";
import { getDb } from "@/lib/server/db";
import { user as userTable } from "@/lib/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = getDb();
        const allUsers = await db.select({
            id: userTable.id,
            name: userTable.name,
            email: userTable.email,
            role: userTable.role,
            createdAt: userTable.createdAt,
        }).from(userTable).orderBy(desc(userTable.createdAt));

        return NextResponse.json(allUsers);
    } catch (error) {
        console.error("Admin users GET error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, role } = await req.json();

        if (!id || !role) {
            return NextResponse.json({ error: "ID and Role are required" }, { status: 400 });
        }

        const db = getDb();
        await db.update(userTable)
            .set({ role })
            .where(eq(userTable.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin users PATCH error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
