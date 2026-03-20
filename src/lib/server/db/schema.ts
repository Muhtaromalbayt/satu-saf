import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real, uniqueIndex } from "drizzle-orm/sqlite-core";

// ===== Core User Table (No email/password - Sheet-based login) =====

export const user = sqliteTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email"), // Addition for compatibility
    kelompok: text("kelompok").notNull(), // e.g., "Kelompok A", "Kelompok B"
    sheetRowId: text("sheet_row_id"), // Row ID from Google Sheets for sync
    role: text("role").default("santri"), // 'santri', 'mentor', 'admin'
    pin: text("pin"), // 4-digit PIN for santri security
    createdAt: integer("created_at", { mode: "timestamp" })
        .default(sql`(current_timestamp)`)
        .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .default(sql`(current_timestamp)`)
        .$onUpdate(() => new Date())
        .notNull(),
});

// ===== Session Table (Manual token-based) =====

export const session = sqliteTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: integer("created_at", { mode: "timestamp" })
        .default(sql`(current_timestamp)`)
        .notNull(),
});

// ===== Daily Monitoring (14 days × 5 aspects per day) =====

export const dailyMonitoring = sqliteTable("daily_monitoring", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    day: integer("day").notNull(), // 1 to 14
    aspect: text("aspect").notNull(), // 'ibadah' | 'orang_tua' | 'lingkungan' | 'diri_sendiri' | 'setoran'
    isDone: integer("is_done", { mode: "boolean" }).default(false).notNull(),
    notes: text("notes"),
    timestamp: text("timestamp")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
}, (table: any) => ({
    userDayAspectUnique: uniqueIndex("user_day_aspect_idx").on(table.userId, table.day, table.aspect),
}));

// ===== Scores Table =====

export const scores = sqliteTable("scores", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" })
        .unique(), // one score row per user
    hafalan: real("hafalan").default(0), // from CSV
    ujianTulis: real("ujian_tulis").default(0), // from CSV
    qiyamullail: real("qiyamullail").default(0), // from CSV
    monitoring: real("monitoring").default(0), // calculated from daily_monitoring
    hafalanTotal: real("hafalan_total").default(0), // legacy/accumulated
    hafalanCount: integer("hafalan_count").default(0), // legacy
    tesTulis: real("tes_tulis").default(0), // legacy
    tahajudCount: integer("tahajud_count").default(0), // legacy
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .default(sql`(current_timestamp)`)
        .$onUpdate(() => new Date())
        .notNull(),
});

// ===== Mentor Verification (for action nodes / amalan) =====

export const userAmalan = sqliteTable("user_amalan", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    day: integer("day"), // which day (1-14)
    aspect: text("aspect").notNull(),
    deedName: text("deed_name").notNull(),
    status: text("status").notNull(), // 'done', 'not_done', 'pending', 'verified'
    verifiedByMentor: integer("verified_by_mentor", { mode: "boolean" }).default(false),
    mentorNote: text("mentor_note"),
    evidenceUrl: text("evidence_url"), // URL or base64 photo proof
    reflection: text("reflection"),   // Text for student reflection
    capturedAt: text("captured_at"),   // Exact time photo was taken
    timestamp: text("timestamp")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

export const systemSettings = sqliteTable("system_settings", {
    key: text("key").primaryKey(),
    value: text("value").notNull(),
    updatedAt: text("updated_at")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

// ===== Monitoring Tasks (Editable by Admin) =====

export const monitoringTasks = sqliteTable("monitoring_tasks", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    aspectId: text("aspect_id").notNull(), // 'ibadah', 'orang_tua', etc.
    label: text("label").notNull(),
    isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
        .default(sql`(current_timestamp)`)
        .notNull(),
});

// ===== Amalan Reactions (for Lapor Pak!) =====

export const amalanReactions = sqliteTable("amalan_reactions", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    amalanId: integer("amalan_id")
        .notNull()
        .references(() => userAmalan.id, { onDelete: "cascade" }),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // 'emoji', 'text'
    content: text("content").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
        .default(sql`(current_timestamp)`)
        .notNull(),
});

// ===== Matching Pool for Quiz Nodes =====

export const matchingPool = sqliteTable("matching_pool", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    left: text("left").notNull(),
    right: text("right").notNull(),
    category: text("category"),
    createdAt: integer("created_at", { mode: "timestamp" })
        .default(sql`(current_timestamp)`)
        .notNull(),
});

// ===== Account Table (Legacy/Auth compatibility) =====

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
    accessTokenExpiresAt: integer("access_token_expires_at"),
    refreshTokenExpiresAt: integer("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp" })
        .default(sql`(current_timestamp)`)
        .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// ===== Verification Table (Legacy/Auth compatibility) =====

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
        .notNull(),
});

// ===== Lessons Table =====

export const lessons = sqliteTable("lessons", {
    id: text("id").primaryKey(),
    chapter: integer("chapter").notNull(),
    type: text("type").notNull(),
    title: text("title"),
    content: text("content"),
    createdAt: text("created_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});

// ===== Progress Table =====

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
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});
