-- Seed Data for Categories (4 categories - min 3 requirement)
INSERT INTO categories (id, name, color, badge_bg, badge_text, created_at) VALUES
('cat-work', 'Work', '#4f46e5', 'bg-indigo-100', 'text-indigo-700', NOW()),
('cat-personal', 'Personal', '#10b981', 'bg-emerald-100', 'text-emerald-700', NOW()),
('cat-health', 'Health', '#f43f5e', 'bg-rose-100', 'text-rose-700', NOW()),
('cat-shopping', 'Shopping', '#f59e0b', 'bg-amber-100', 'text-amber-700', NOW())
ON CONFLICT (id) DO NOTHING;

-- Seed Data for Tasks (10 tasks - min 8 requirement)
INSERT INTO tasks (id, title, description, category_id, status, due_date, is_starred, created_at) VALUES
('task-1', 'Finalize Q3 Revenue Deck', 'Review financial metrics with executive team, format charts, and compile revenue growth slides.', 'cat-work', 'open', '2026-07-25', true, '2026-07-20T10:00:00Z'),
('task-2', 'Morning Interval Cardio & Core', '30-minute high-intensity cardio workout followed by core endurance routines.', 'cat-health', 'open', '2026-07-23', false, '2026-07-21T08:30:00Z'),
('task-3', 'Buy Organic Groceries & Produce', 'Fresh avocados, almond milk, sourdough bread, and eco household cleaners.', 'cat-shopping', 'done', '2026-07-22', false, '2026-07-19T14:15:00Z'),
('task-4', 'UI Design System Audit', 'Refactor atomic component colors, verify accessibility contrast scores, and optimize NativeWind theme tokens.', 'cat-work', 'open', '2026-07-28', true, '2026-07-22T09:00:00Z'),
('task-5', 'Reserve Vacation Flight Tickets', 'Compare airline flight schedules and book round-trip tickets for summer retreat.', 'cat-personal', 'open', '2026-07-30', false, '2026-07-18T16:45:00Z'),
('task-6', 'Schedule Annual Physical Exam', 'Book appointment with primary physician for annual routine checkup and blood tests.', 'cat-health', 'open', '2026-08-05', false, '2026-07-17T11:20:00Z'),
('task-7', 'Refactor API Authentication Middleware', 'Implement JWT token refresh rotation and rate limiting handlers across backend routes.', 'cat-work', 'done', '2026-07-21', true, '2026-07-15T13:00:00Z'),
('task-8', 'Purchase Ergonomic Desk Accessories', 'Order dual monitor arm, wrist rest, and cable management tray for home workspace.', 'cat-shopping', 'open', '2026-07-27', false, '2026-07-22T15:30:00Z'),
('task-9', 'Plan Weekend Mountain Trail Hike', 'Check weather forecasts, map out trail routes, and pack hydration gear.', 'cat-personal', 'open', '2026-07-26', true, '2026-07-21T18:00:00Z'),
('task-10', 'Prepare Bi-Weekly Sprint Summary', 'Gather velocity metrics, burndown charts, and team retrospectives for sprint report.', 'cat-work', 'open', '2026-07-29', false, '2026-07-23T08:00:00Z')
ON CONFLICT (id) DO NOTHING;
