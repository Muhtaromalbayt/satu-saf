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

export const { handlers, auth, signIn, signOut } = NextAuth({
    // Use D1 Adapter ONLY if DB binding is available (Production/Wrangler Dev)
    adapter: (() => {
        if (process.env.DB) {
            return D1Adapter(process.env.DB as any);
        }
        console.warn("D1 Database binding 'DB' not found. Auth.js will use temporary session strategy.");
        return undefined;
    })(),
    secret: process.env.AUTH_SECRET || "development-secret-for-satu-saf-v2-local-dev", // Fallback for local dev
    trustHost: true,
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
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
                // Assign role based on email or existing user role
                const role = PRE_SEEDED_MENTORS.includes(user.email) ? 'mentor' : (user.role || 'student');
                token.role = role;
                // Profile is complete if it's a mentor OR if student data exists
                token.isProfileComplete = role === 'mentor' || !!(user.kelas && user.gender);
            }

            // Handle manual session update (from client side)
            if (trigger === "update" && session) {
                if (session.name) token.name = session.name;
                if (session.role) {
                    token.role = session.role;
                }
                if (session.isProfileComplete !== undefined) {
                    token.isProfileComplete = session.isProfileComplete;
                }
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
        newUser: "/register/profile", // Redirect new users to complete profile
    },
});
