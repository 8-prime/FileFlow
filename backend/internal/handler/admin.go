package handler

import (
	"backend/internal/model"
	"backend/internal/repository"
	"backend/internal/utils"
	"encoding/json"
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

func UpdateUpload(repo *repository.Repository) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idParam := chi.URLParam(r, "id")
		var updateRequest model.UploadUpate
		err := json.NewDecoder(r.Body).Decode(&updateRequest)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		if updateRequest.MAX_DOWNLOADS < -1 {
			http.Error(w, "Invalid max downloads", http.StatusBadRequest)
			return
		}
		timestampFromDuration, err := utils.ParseDurationToTime(updateRequest.EXPIRATION)
		if err != nil {
			http.Error(w, "Invalid expiration", http.StatusBadRequest)
			return
		}
		err = repo.UpdateUpload(r.Context(), idParam, updateRequest.MAX_DOWNLOADS, timestampFromDuration)
		if err != nil {
			http.Error(w, "Failed to update upload", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	}
}
