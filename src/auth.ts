import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { D1Adapter } from "@auth/d1-adapter";

// Mentor emails that will be automatically assigned the 'mentor' role
const PRE_SEEDED_MENTORS = [
    'mentor1@gmail.com',
    'mentor2@gmail.com',
    'mentor3@gmail.com'
];

/**
 * Configure Auth.js with dynamic environment access for Cloudflare Edge.
 * In Cloudflare Pages, environment variables and D1 bindings are passed via the request object.
 */
export const { handlers, auth, signIn, signOut } = NextAuth((req) => {
    // Attempt to read environment from Cloudflare Request (next-on-pages)
    const env = (req as any)?.env || (req as any)?.context?.env || process.env;

    // Explicitly check for DB binding
    const db = env?.DB;

    return {
        // Step 1 Debug: Matikan adapter (Super Cepat)
        adapter: undefined,

        // Use AUTH_SECRET from Cloudflare env if available, otherwise process.env
        secret: env?.AUTH_SECRET || process.env.AUTH_SECRET || "development-secret-for-satu-saf-v2-local-dev",

        trustHost: true,
        providers: [
            // Resilient Google Provider initialization
            ...(env?.AUTH_GOOGLE_ID && env?.AUTH_GOOGLE_SECRET ? [
                Google({
                    clientId: env.AUTH_GOOGLE_ID,
                    clientSecret: env.AUTH_GOOGLE_SECRET,
                })
            ] : []),
            Credentials({
                name: "Mentor Credentials",
                credentials: {
                    email: { label: "Email", type: "email" },
                    password: { label: "Password", type: "password" }
                },
                async authorize(credentials) {
                    if (!credentials?.email || !credentials?.password) return null;

                    const email = credentials.email as string;
                    const password = credentials.password as string;

                    // Simple check for pre-seeded mentors
                    if (PRE_SEEDED_MENTORS.includes(email) && password === "alfath2026") {
                        return { id: email, email, name: email.split('@')[0], role: 'mentor' };
                    }
                    return null;
                }
            })
        ],
        session: { strategy: "jwt" },
        callbacks: {
            async jwt({ token, user, trigger, session }: any) {
                if (user) {
                    token.id = user.id;
                    const role = PRE_SEEDED_MENTORS.includes(user.email) ? 'mentor' : (user.role || 'student');
                    token.role = role;
                    token.isProfileComplete = role === 'mentor' || !!(user.kelas && user.gender);
                }

                if (trigger === "update" && session) {
                    if (session.name) token.name = session.name;
                    if (session.role) token.role = session.role;
                    if (session.isProfileComplete !== undefined) token.isProfileComplete = session.isProfileComplete;
                }

                return token;
            },
            async session({ session, token }: any) {
                if (session.user) {
                    session.user.id = token.id as string;
                    session.user.role = token.role as any;
                    session.user.isProfileComplete = token.isProfileComplete as boolean;
                }
                return session;
            },
            async signIn({ user }: any) {
                return !!user.email;
            },
        },
        pages: {
            signIn: "/login",
            newUser: "/register/profile",
        },
    };
});
