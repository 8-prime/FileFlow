package repository

import (
	"backend/internal/model"
	"backend/internal/utils"
	"context"
	"database/sql"
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
	parsedExpiration, err := utils.ParseDurationToTime(expiration)
	if err != nil {
		return upload, err
	}
	upload.EXPIRES = parsedExpiration
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
	_, err = r.db.Exec(
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

func (r *Repository) GetUploads(ctx context.Context, page int64) ([]model.UploadInfo, error) {
	var infos []model.UploadInfo

	rows, err := r.db.QueryContext(ctx, `
		SELECT
			id,
			max_downloads,
			current_downloads,
			uploaded,
			expiration,
			upload_status
		FROM
			UPLOADS
		ORDER BY
			uploaded
		LIMIT 10
		OFFSET (?) * 10;
	`, page)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var info model.UploadInfo
		rows.Scan(&info.ID, &info.MAX_DOWNLOADS, &info.CURRENT_DOWNLOADS, &info.UPLOADED, &info.EXPIRES, &info.STATUS)
		infos = append(infos, info)
	}

	return infos, nil
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
