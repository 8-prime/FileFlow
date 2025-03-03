package handler

import (
	"backend/internal/model"
	"backend/internal/repository"
	"net/http"
	"os"
	"path"

	"github.com/go-chi/chi"
)

func SoftDeleteEntry(repo *repository.Repository, cfg *UploadConfig) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idParam := chi.URLParam(r, "id")
		fsPath := path.Join(cfg.FilesPath, idParam)

		err := repo.UpdateStatus(r.Context(), idParam, model.StatusDeleted)
		if err != nil {
			http.Error(w, "Failed to set entry as deleted", http.StatusInternalServerError)
			return
		}
		err = os.RemoveAll(fsPath)
		if err != nil {
			http.Error(w, "Failed to remove files for upload", http.StatusInternalServerError)
			return
		}
	}
}
