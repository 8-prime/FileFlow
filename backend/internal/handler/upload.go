package handler

import (
	"backend/internal/model"
	"backend/internal/repository"
	"encoding/json"
	"io"
	"log"
	"math"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strconv"
	"time"

	"github.com/go-chi/chi"
)

func HandleUpload(repo *repository.Repository) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseMultipartForm(math.MaxInt64)
		if err != nil {
			http.Error(w, "Unable to parse form", http.StatusBadRequest)
			return
		}
		maxDownloads := r.MultipartForm.Value["maxDownloads"]
		maxDownloadsParsed, err := strconv.ParseInt(maxDownloads[0], 0, 64)
		if err != nil || maxDownloadsParsed < 1 {
			http.Error(w, "Specify valid amound for max downloads", http.StatusBadRequest)
			return
		}
		expiration := r.MultipartForm.Value["expiration"]
		files := r.MultipartForm.File["files"]
		if len(files) == 0 {
			http.Error(w, "No files uploaded", http.StatusBadRequest)
			return
		}

		newEntry, err := repo.SaveEntry(r.Context(), maxDownloadsParsed, expiration[0])
		if err != nil {
			http.Error(w, "Failed to save upload", http.StatusInternalServerError)
			return
		}
		filesDir := path.Join("./uploads", newEntry.ID)
		os.MkdirAll(filesDir, os.ModePerm)

		for _, fileHeader := range files {
			// Open the uploaded file
			file, err := fileHeader.Open()
			if err != nil {
				http.Error(w, "Unable to open file", http.StatusInternalServerError)
				return
			}
			defer file.Close()

			// Create a destination file
			destPath := filepath.Join(filesDir, fileHeader.Filename)
			destFile, err := os.Create(destPath)
			if err != nil {
				http.Error(w, "Unable to create file", http.StatusInternalServerError)
				return
			}
			defer destFile.Close()

			// Copy the uploaded file to the destination file
			_, err = io.Copy(destFile, file)
			if err != nil {
				http.Error(w, "Unable to save file", http.StatusInternalServerError)
				return
			}
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		enc := json.NewEncoder(w)
		if err := enc.Encode(newEntry); err != nil {
			http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
			return
		}
	}

}

func GetUpload(repo *repository.Repository) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idParam := chi.URLParam(r, "id")
		log.Printf("Got request with id: %s", idParam)
		entry, err := repo.GetUpload(r.Context(), idParam)
		if err != nil {
			http.Error(w, "Failed to retrieve upload info", http.StatusBadRequest)
			return
		}

		//validate is not expired
		if entry.EXPIRES < time.Now().UTC().Unix() {
			http.Error(w, "Upload is expired", http.StatusBadRequest)
			repo.UpdateStatus(r.Context(), idParam, model.StatusExpired)
			return
		}
		//validate downloads not exhausted
		if entry.CURRENT_DOWNLOADS >= entry.MAX_DOWNLOADS {
			http.Error(w, "All downloads are used up", http.StatusBadRequest)
			repo.UpdateStatus(r.Context(), idParam, model.StatusExpired)
			return
		}

		//read files from fs
		filesDir := path.Join("./uploads", entry.ID)
		entries, err := os.ReadDir(filesDir)
		if err != nil {
			http.Error(w, "Failed to read files", http.StatusInternalServerError)
			return
		}
		var dlInfo model.DownloadInfo
		for _, e := range entries {
			dlInfo.FILES = append(dlInfo.FILES, e.Name())
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		enc := json.NewEncoder(w)
		if err := enc.Encode(dlInfo); err != nil {
			http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
			return
		}
	}
}
