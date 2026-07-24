
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#6366f1',
    badge_bg TEXT NOT NULL DEFAULT 'bg-indigo-100',
    badge_text TEXT NOT NULL DEFAULT 'text-indigo-700',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('open', 'done')) DEFAULT 'open',
    due_date TEXT NOT NULL,
    is_starred BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_category ON tasks(category_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public insert on categories" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on categories" ON categories FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on categories" ON categories FOR DELETE USING (true);

CREATE POLICY "Allow public read access on tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Allow public insert on tasks" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on tasks" ON tasks FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on tasks" ON tasks FOR DELETE USING (true);
