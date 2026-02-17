-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- Auth.js User ID
    name TEXT,
    email TEXT UNIQUE,
    emailVerified INTEGER, -- Timestamp for Auth.js
    image TEXT, -- Google profile image
    role TEXT CHECK(role IN ('student', 'mentor', 'parent')) NOT NULL DEFAULT 'student',
    xp INTEGER DEFAULT 0,
    hearts INTEGER DEFAULT 5,
    streak_count INTEGER DEFAULT 0,
    kelas TEXT, -- For Student/Parent
    gender TEXT, -- For Student/Parent
    last_active_at INTEGER, -- Timestamp
    group_id TEXT, -- For mentor-student grouping
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- NextAuth Tables (for D1 Adapter)
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  providerAccountId TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  sessionToken TEXT NOT NULL UNIQUE,
  userId TEXT NOT NULL,
  expires INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires INTEGER NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    chapter_day INTEGER NOT NULL,
    node_type TEXT CHECK(node_type IN ('story', 'quiz', 'recite', 'action', 'checklist')) NOT NULL,
    content_json TEXT NOT NULL, -- JSON string of the slide content
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Progress Table
CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT 0,
    completed_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- Approvals Table (For Action Nodes)
CREATE TABLE IF NOT EXISTS approvals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    mentor_id TEXT, -- Assigned mentor
    lesson_id TEXT NOT NULL,
    proof_data TEXT, -- Image URL or text description
    status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_group ON users(group_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_approvals_mentor ON approvals(mentor_id, status);
