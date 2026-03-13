CREATE TABLE IF NOT EXISTS climbs (
  id       TEXT PRIMARY KEY,
  grade    TEXT NOT NULL,
  color    TEXT NOT NULL,
  tags     TEXT NOT NULL DEFAULT '[]',
  date     TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  notes    TEXT NOT NULL DEFAULT '',
  images   TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
