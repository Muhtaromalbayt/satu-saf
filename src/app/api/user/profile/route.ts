import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const { role, name, kelas, gender } = data;

        // Update profile in Supabase (Postgres)
        const { error } = await supabase
            .from('users')
            .update({
                role,
                name,
                kelas,
                gender
            })
            .eq('id', user.id);

        if (error) {
            console.error("Supabase profile update error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Also update auth metadata for faster UI access
        await supabase.auth.updateUser({
            data: { role, name, isProfileComplete: true }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
