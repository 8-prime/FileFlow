package repository

import (
	"backend/internal/model"
	"context"
	"database/sql"
	"math"
	"strconv"
	"time"

	"github.com/google/uuid"
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
            SUM(CASE WHEN expiration > ? THEN 1 ELSE 0 END) as active_downloads,
            SUM(current_downloads) as total_downloads
        FROM UPLOADS
    `, time.Now().UTC().Unix()).Scan(&stats.TOTAL_UPLOADS, &stats.ACTIVE_DOWNLOADS, &stats.TOTAL_DOWNLOADS)

	if err != nil {
		return stats, err
	}

	return stats, nil
}

func (r *Repository) SaveEntry(ctx context.Context, maxDownloads int64, expiration string) (model.UploadInfo, error) {
	var upload model.UploadInfo
	upload.ID = uuid.NewString()
	upload.CURRENT_DOWNLOADS = 0
	upload.MAX_DOWNLOADS = maxDownloads
	if expiration == "never" {
		upload.EXPIRES = math.MaxInt64
	} else {
		i, err := strconv.ParseInt(expiration[:len(expiration)-1], 0, 64)
		if err != nil {
			return upload, err
		}
		upload.EXPIRES = time.Now().UTC().AddDate(0, 0, int(i)).Unix()
	}
	upload.STATUS = model.StatusActive
	upload.UPLOADED = time.Now().UTC().Unix()

	query := `
    INSERT INTO UPLOADS (
        id,
        max_downloads,
        current_downloads,
        uploaded,
        expiration,
        upload_status
    ) VALUES (?, ?, ?, ?, ?, ?)
    `
	_, err := r.db.Exec(
		query,
		upload.ID,
		upload.MAX_DOWNLOADS,
		upload.CURRENT_DOWNLOADS,
		upload.UPLOADED,
		upload.EXPIRES,
		upload.STATUS,
	)

	return upload, err
}

func (r *Repository) DeleteEntry(ctx context.Context, id string) error {
	query := `
	DELETE FROM UPLOADS
	WHERE id = ?;
    `
	_, err := r.db.Exec(query, id)
	return err
}

func (r *Repository) UpdateStatus(ctx context.Context, id string, status model.Status) error {
	query := `
	UPDATE UPLOADS
	SET upload_status = ?
	WHERE id = ?
	`
	_, err := r.db.Exec(query, status, id)

	return err
}

func (r *Repository) GetUpload(ctx context.Context, id string) (model.UploadInfo, error) {
	var info model.UploadInfo

	err := r.db.QueryRowContext(ctx, `
        SELECT 
			id,
			max_downloads,
			current_downloads,
			uploaded,
			expiration,
			upload_status
        FROM UPLOADS
		WHERE id = ?
    `, id).Scan(&info.ID, &info.MAX_DOWNLOADS, &info.CURRENT_DOWNLOADS, &info.UPLOADED, &info.EXPIRES, &info.STATUS)

	if err != nil {
		return info, err
	}

	return info, nil
}

func (r *Repository) UpdateDownloads(ctx context.Context, id string, downloads int64) error {
	query := `
	UPDATE UPLOADS
	SET current_downloads = current_downloads + ?
	WHERE id = ?
	`
	_, err := r.db.Exec(query, downloads, id)

	return err
}
