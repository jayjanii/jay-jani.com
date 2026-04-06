CREATE TABLE IF NOT EXISTS papers (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  authors    TEXT NOT NULL DEFAULT '',
  url        TEXT NOT NULL DEFAULT '',
  year       TEXT NOT NULL DEFAULT '',
  status     TEXT NOT NULL DEFAULT 'to-read',
  tags       TEXT NOT NULL DEFAULT '[]',
  notes      TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
