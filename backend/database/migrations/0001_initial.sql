CREATE TABLE IF NOT EXISTS UPLOADS (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    upload_id INTEGER,
    max_downloads INTEGER,
    current_downloads INTEGER,
    expiration INTEGER,
    upload_status TEXT
)