import { auth } from "./auth";
import { headers } from "next/headers";

/**
 * Checks if the current session belongs to an admin user.
 * Returns the session if admin, otherwise null.
 */
export async function getAdminSession() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        return null;
    }

    // Role can be part of user object if correctly mapped in BetterAuth
    // Or we can check directly from our DB if needed.
    // For now, we assume the user object has the role property.
    const user = session.user as any;

    if (user.role === 'admin') {
        return session;
    }

    return null;
}
