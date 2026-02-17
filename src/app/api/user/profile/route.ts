import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const { role, name, kelas, gender } = data;

        const db = (process.env.DB as any);

        if (!db || !db.prepare) {
            console.warn("DB binding not found or invalid. Profile update skipped (Local Dev mode).");
            return NextResponse.json({ success: true, message: "Profile update skipped in local dev" });
        }

        // Update the user record. Auth.js already created it on first sign in.
        await db.prepare(
            "UPDATE users SET role = ?, name = ?, kelas = ?, gender = ? WHERE id = ?"
        ).bind(role, name, kelas, gender, (session.user as any).id).run();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
