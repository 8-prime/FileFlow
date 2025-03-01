package database

import (
	"database/sql"
	"time"

	_ "embed"

	_ "github.com/mattn/go-sqlite3"
)

// Config holds database configuration
type Config struct {
	DBPath      string
	MaxConns    int
	IdleTimeout time.Duration
}

//go:embed 0001_initial.sql
var migration string

// InitDB initializes and configures the SQLite database
func InitDB(cfg Config) (*sql.DB, error) {
	db, err := sql.Open("sqlite3", cfg.DBPath)
	if err != nil {
		return nil, err
	}

	// Configure connection pool
	db.SetMaxOpenConns(cfg.MaxConns)
	db.SetMaxIdleConns(cfg.MaxConns)
	db.SetConnMaxLifetime(cfg.IdleTimeout)

	db.Exec(migration)

	// Test the connection
	if err := db.Ping(); err != nil {
		db.Close()
		return nil, err
	}

	// Enable WAL mode for better concurrency
	if _, err := db.Exec("PRAGMA journal_mode=WAL;"); err != nil {
		db.Close()
		return nil, err
	}

	// Other helpful SQLite optimizations
	if _, err := db.Exec("PRAGMA synchronous=NORMAL;"); err != nil {
		db.Close()
		return nil, err
	}

	return db, nil
}
