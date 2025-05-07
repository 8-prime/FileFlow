package app

import (
	"backend/internal/model"
	"context"
	"database/sql"
	"os"
	"path"
	"time"
)

func (app *Application) StartFileManager() {
	app.ExpirationUpdate = make(chan time.Time)
	go RunFileManager(app)
}

func RunFileManager(app *Application) {
	cleanFiles(app)
	currentExpiration, err := GetNextExpiration(context.Background(), app.DB)
	if err != nil {
		return
	}

	if !currentExpiration.After(time.Now()) {
		cleanFiles(app)
	}

	var time time.Time
	time = nil

	for {
		select {
		case <-app.ExpirationUpdate:
			expiration, err := GetNextExpiration(context.Background(), app.DB)
			if err != nil {
				continue
			}
			if expiration.After(lastExpiration) {
				lastExpiration = expiration
				app.Config.SERVER.UpdateExpiration(expiration)
			}
		}
	}
}

func cleanFiles(app *Application) {
	var query = `SELECT id FROM UPLOADS WHERE expiration < ? AND upload_status = ?`

	rows, err := app.DB.QueryContext(context.Background(), query, time.Now().UTC().Unix(), model.StatusActive)
	if err != nil {
		return
	}
	defer rows.Close()
	removedIds := make([]string, 0)
	for rows.Next() {
		var id string
		rows.Scan(&id)
		fsPath := path.Join(app.Config.SERVER.FilesPath, id)
		err = os.RemoveAll(fsPath)
		if err != nil {
			continue
		}
		removedIds = append(removedIds, id)
	}

}

func GetNextExpiration(ctx context.Context, db *sql.DB) (time.Time, error) {
	var expiration int64

	query := `
		SELECT
			MIN(expiration)
		FROM
			UPLOADS
		WHERE
			expiration > ? AND upload_status = ?
	`

	err := db.QueryRowContext(ctx, query, time.Now().UTC().Unix(), model.StatusActive).Scan(&expiration)
	if err != nil {
		return time.Time{}, err
	}
	return time.Unix(expiration, 0), nil
}
