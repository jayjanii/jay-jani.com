CREATE TABLE IF NOT EXISTS projects (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  github_url   TEXT NOT NULL DEFAULT '',
  is_private   INTEGER NOT NULL DEFAULT 0,
  demo_url     TEXT NOT NULL DEFAULT '',
  demo_label   TEXT NOT NULL DEFAULT '',
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
