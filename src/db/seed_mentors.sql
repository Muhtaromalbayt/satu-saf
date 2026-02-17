-- Pre-seeded Mentor Accounts
-- Replace with the actual Google IDs after first login, or rely on email detection for auto-role assignment.
-- Note: It's safer to have a logic in auth.ts that checks email and assigns 'mentor' role on first login.

-- For now, we can seed them by email if we add email to the seeder logic or a separate config.
-- This is just a reference script.

INSERT INTO users (id, name, email, role) VALUES 
('mentor-1-placeholder', 'Mentor 1', 'mentor1@gmail.com', 'mentor'),
('mentor-2-placeholder', 'Mentor 2', 'mentor2@gmail.com', 'mentor'),
('mentor-3-placeholder', 'Mentor 3', 'mentor3@gmail.com', 'mentor')
ON CONFLICT(email) DO UPDATE SET role = 'mentor';
