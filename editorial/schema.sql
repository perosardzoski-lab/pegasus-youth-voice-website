-- Pegasus Youth Voice: private D1 editorial data (do not store this SQL in a public browser).
-- Apply with Cloudflare D1 console after creating database bound as EDITORIAL_DB.
CREATE TABLE IF NOT EXISTS editorial_submissions (
 id TEXT PRIMARY KEY,
 title TEXT NOT NULL,
 category TEXT NOT NULL,
 locale TEXT NOT NULL CHECK(locale IN ('en','mk','sq')),
 display_name TEXT NOT NULL DEFAULT '',
 reply_email TEXT NOT NULL DEFAULT '',
 body TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'submitted' CHECK(status IN ('submitted','reviewing','changes_requested','approved','published','rejected')),
 editor_notes TEXT NOT NULL DEFAULT '',
 approved_by TEXT,
 submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_editorial_submissions_status_date ON editorial_submissions(status,submitted_at DESC);
CREATE TABLE IF NOT EXISTS editorial_events(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 submission_id TEXT NOT NULL,
 actor TEXT NOT NULL,
 action TEXT NOT NULL,
 details TEXT NOT NULL DEFAULT '',
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 FOREIGN KEY(submission_id) REFERENCES editorial_submissions(id)
);
CREATE INDEX IF NOT EXISTS idx_editorial_events_submission ON editorial_events(submission_id,created_at);

CREATE TABLE IF NOT EXISTS editorial_images (
 id TEXT PRIMARY KEY,
 submission_id TEXT NOT NULL,
 object_key TEXT NOT NULL UNIQUE,
 original_name TEXT NOT NULL,
 mime_type TEXT NOT NULL,
 byte_size INTEGER NOT NULL,
 position INTEGER NOT NULL,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 FOREIGN KEY(submission_id) REFERENCES editorial_submissions(id)
);
CREATE INDEX IF NOT EXISTS idx_editorial_images_submission ON editorial_images(submission_id,position);
