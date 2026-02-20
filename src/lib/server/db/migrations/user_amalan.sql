-- Migration to create user_amalan table
CREATE TABLE IF NOT EXISTS user_amalan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    chapter_id TEXT NOT NULL,
    deed_name TEXT NOT NULL,
    status TEXT NOT NULL,
    timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
