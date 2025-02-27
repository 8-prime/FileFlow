package handler

import (
	"backend/internal/repository"
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net/http"
	"os"
	"path/filepath"
)

func HandleGetStats(repo *repository.Repository) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		stats, err := repo.GetStats(ctx)
		if err != nil {
			http.Error(w, "Failed to retrieve stats", http.StatusInternalServerError)
			return
		}

		// In production, you'd use a proper JSON encoder/response helper
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		// Simplified response for brevity - use proper JSON handling in production
		enc := json.NewEncoder(w)
		if err := enc.Encode(stats); err != nil {
			http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
			return
		}
	}
}

func UploadHandler(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(math.MaxInt64)
	if err != nil {
		http.Error(w, "Unable to parse form", http.StatusBadRequest)
		return
	}

	files := r.MultipartForm.File["files"]
	if len(files) == 0 {
		http.Error(w, "No files uploaded", http.StatusBadRequest)
		return
	}

	uploadDir := "./uploads"
	os.MkdirAll(uploadDir, os.ModePerm)

	for _, fileHeader := range files {
		// Open the uploaded file
		file, err := fileHeader.Open()
		if err != nil {
			http.Error(w, "Unable to open file", http.StatusInternalServerError)
			return
		}
		defer file.Close()

		// Create a destination file
		destPath := filepath.Join(uploadDir, fileHeader.Filename)
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

	// Respond with success
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Files uploaded successfully")
}
