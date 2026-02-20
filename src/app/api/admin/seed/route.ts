import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
import { getDb } from "@/lib/server/db";
import { user } from "@/lib/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const email = "admin@satusaf.com";
        const password = "adminpassword123";
        const name = "Super Admin";

        console.log("Attempting to reset admin user...");

        // Delete existing user if any
        const db = getDb();
        await db.delete(user).where(eq(user.email, email));
        console.log("Deleted existing admin user (if any).");

        // Try to sign up
        const signUpRes = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name,
                role: "admin",
                gender: "Laki-laki",
                grade: "Admin",
                mosque: "Al-Azhar",
            },
            asResponse: true
        });

        if (signUpRes.ok) {
            const userData = await signUpRes.json();
            console.log("User created:", userData);
            return NextResponse.json({ success: true, user: userData, message: "Admin created successfully with password: " + password });
        }

        const signUpError = await signUpRes.json();
        return NextResponse.json({ success: false, error: signUpError }, { status: 500 });
    } catch (error: any) {
        console.error("Seed Error:", error);
        return NextResponse.json({ success: false, error: error.message || "Failed to create admin" }, { status: 500 });
    }
}
