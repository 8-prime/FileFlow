package repository

import (
	"backend/internal/model"
	"context"
	"database/sql"
)

type Repository struct {
	db *sql.DB
}

// NewRepository creates a new repository with the given database connection
func NewRepository(db *sql.DB) *Repository {
	return &Repository{
		db: db,
	}
}

func (r *Repository) GetStats(ctx context.Context) (model.Stats, error) {
	var stats model.Stats

	err := r.db.QueryRowContext(ctx, `
        SELECT 
            COUNT(*) as total_uploads,
            SUM(CASE WHEN upload_status = 'active' THEN 1 ELSE 0 END) as active_downloads,
            SUM(current_downloads) as total_downloads
        FROM UPLOADS
    `).Scan(&stats.TOTAL_UPLOADS, &stats.ACTIVE_DOWNLOADS, &stats.TOTAL_DOWNLOADS)

	if err != nil {
		return stats, err
	}

	return stats, nil
}
