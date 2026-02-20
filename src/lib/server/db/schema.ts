import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// ===== BetterAuth Tables =====

export const user = sqliteTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: integer("email_verified", { mode: "boolean" })
        .default(false)
        .notNull(),
    image: text("image"),
    role: text("role").default("santri"), // 'santri', 'mentor', 'parent', 'admin'
    gender: text("gender"), // 'Laki-laki', 'Perempuan'
    grade: text("grade"), // 'Kelas' (for Santri)
    mosque: text("mosque"), // 'Asal Masjid'
    createdAt: integer("created_at", { mode: "timestamp" })
        .default(sql`(current_timestamp)`)
        .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .default(sql`(current_timestamp)`)
        .$onUpdate(() => new Date())
        .notNull(),
});

export const session = sqliteTable("session", {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp" })
        .default(sql`(current_timestamp)`)
        .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .$onUpdate(() => new Date())
        .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp" })
        .default(sql`(current_timestamp)`)
        .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .$onUpdate(() => new Date())
        .notNull(),
});

export const verification = sqliteTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
        .default(sql`(current_timestamp)`)
        .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .default(sql`(current_timestamp)`)
        .$onUpdate(() => new Date())
        .notNull(),
});

// ===== App Tables =====

export const lessons = sqliteTable("lessons", {
    id: text("id").primaryKey(),
    chapter: integer("chapter").notNull(),
    type: text("type").notNull(), // 'story', 'recite', 'quiz', 'action'
    title: text("title"),
    content: text("content"), // JSON string
    createdAt: text("created_at")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

export const progress = sqliteTable("progress", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id")
        .notNull()
        .references(() => lessons.id, { onDelete: "cascade" }),
    isVerified: integer("is_verified", { mode: "boolean" }).default(false),
    createdAt: text("created_at")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

export const userAmalan = sqliteTable("user_amalan", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    chapterId: text("chapter_id").notNull(),
    deedName: text("deed_name").notNull(),
    status: text("status").notNull(), // e.g., 'done', 'not_done'
    timestamp: text("timestamp")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});
