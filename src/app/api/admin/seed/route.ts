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

        // Create new admin user
        const adminId = "admin-1";
        const result = await db.insert(user).values({
            id: adminId,
            email,
            name,
            role: "admin",
            kelompok: "Admin",
            pin: "1234", // Default PIN
        }).returning();

        console.log("Admin user created:", result[0]);
        return NextResponse.json({
            success: true,
            user: result[0],
            message: "Admin created successfully with PIN: 1234"
        });
    } catch (error: any) {
        console.error("Seed Error:", error);
        return NextResponse.json({ success: false, error: error.message || "Failed to create admin" }, { status: 500 });
    }
}
