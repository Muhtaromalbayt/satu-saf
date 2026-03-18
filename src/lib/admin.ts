import { getCurrentUser } from "@/lib/server/session";

/**
 * Checks if the current session belongs to an admin user.
 * Returns the user if admin, otherwise null.
 */
export async function getAdminSession() {
    const user = await getCurrentUser();

    if (!user) {
        return null;
    }

    if (user.role === 'admin') {
        return { user };
    }

    return null;
}
