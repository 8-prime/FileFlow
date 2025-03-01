CREATE TABLE IF NOT EXISTS UPLOADS (
    id TEXT PRIMARY KEY,
    max_downloads INTEGER,
    current_downloads INTEGER,
    uploaded INTEGER,
    expiration INTEGER,
    upload_status TEXT
)