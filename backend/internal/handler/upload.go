package handler

import (
	"backend/internal/model"
	"backend/internal/repository"
	"encoding/json"
	"errors"
	"io"
	"io/fs"
	"log"
	"math"
	"mime/multipart"
	"net/http"
	"net/url"
	"os"
	"path"
	"path/filepath"
	"strconv"
	"time"

	"github.com/dustin/go-humanize"
	"github.com/go-chi/chi"
)

// Config holds database configuration
type UploadConfig struct {
	FilesPath string
}

func HandleUpload(repo *repository.Repository, cfg *UploadConfig) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseMultipartForm(math.MaxInt64)
		if err != nil {
			http.Error(w, "Unable to parse form", http.StatusBadRequest)
			return
		}
		maxDownloads := r.MultipartForm.Value["maxDownloads"]
		maxDownloadsParsed, err := strconv.ParseInt(maxDownloads[0], 0, 64)
		if err != nil || maxDownloadsParsed < 1 {
			http.Error(w, "Specify valid amount for max downloads", http.StatusBadRequest)
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

		success := saveFilesFromForm(cfg, newEntry, files, w)
		if !success {
			return
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

func GetDownloadInfo(repo *repository.Repository, cfg *UploadConfig) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idParam := chi.URLParam(r, "id")
		log.Printf("Got request with id: %s", idParam)
		entry, err := repo.GetUpload(r.Context(), idParam)
		if err != nil {
			http.Error(w, "Failed to retrieve upload info", http.StatusBadRequest)
			return
		}

		res, err := uploadIsValid(entry, &w, r, cfg, repo, idParam)
		if !res || err != nil {
			return
		}

		dlInfo, success := getInfoForUpload(cfg, entry, w)
		if !success {
			return
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

func GetFile(repo *repository.Repository, cfg *UploadConfig) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idParam := chi.URLParam(r, "id")
		filename := chi.URLParam(r, "file")

		upload, err := repo.GetUpload(r.Context(), idParam)
		if err != nil {
			http.Error(w, "Failed to get upload", http.StatusBadRequest)
			return
		}

		res, err := uploadIsValid(upload, &w, r, cfg, repo, idParam)
		if !res || err != nil {
			return
		}

		decoded, err := url.QueryUnescape(filename)
		if err != nil {
			http.Error(w, "Invalid filename", http.StatusBadRequest)
			return
		}
		filePath := path.Join(cfg.FilesPath, upload.ID, decoded)
		log.Printf("Trying to serve file. %s", filePath)
		repo.UpdateDownloads(r.Context(), idParam, 1)
		http.ServeFile(w, r, filePath)
	}
}

func GetUploads(repo *repository.Repository, cfg *UploadConfig) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		page, err := strconv.ParseInt(r.URL.Query().Get("page"), 0, 64)
		if err != nil {
			page = 0
		}
		// set fixed page size to 10 for now. cbf
		uploads, err := repo.GetUploads(r.Context(), page)
		if err != nil {
			http.Error(w, "Failed to get uploads", http.StatusInternalServerError)
		}
		var infos []model.DownloadInfo
		for _, e := range uploads {
			info, success := getInfoForUpload(cfg, e, w)
			if !success {
				return
			}
			infos = append(infos, info)
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		enc := json.NewEncoder(w)
		if err := enc.Encode(infos); err != nil {
			http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
			return
		}
	}
}

func uploadIsValid(entry model.UploadInfo, w *http.ResponseWriter, r *http.Request, cfg *UploadConfig, repo *repository.Repository, idParam string) (bool, error) {
	if entry.STATUS != model.StatusActive {
		http.Error(*w, "Upload is expired or deleted", http.StatusBadRequest)
		return false, nil
	}

	fsPath := path.Join(cfg.FilesPath, entry.ID)
	exists, err := exists(fsPath)
	if !exists || err != nil {
		http.Error(*w, "Files for upload don't exist", http.StatusInternalServerError)
		repo.UpdateStatus(r.Context(), entry.ID, model.StatusDeleted)
		return false, nil
	}

	//validate is not expired
	if entry.EXPIRES < time.Now().UTC().Unix() {
		http.Error(*w, "Upload is expired", http.StatusBadRequest)
		repo.UpdateStatus(r.Context(), idParam, model.StatusExpired)
		os.RemoveAll(fsPath)
		return false, nil
	}
	//validate downloads not exhausted
	if entry.CURRENT_DOWNLOADS >= entry.MAX_DOWNLOADS {
		http.Error(*w, "All downloads are used up", http.StatusBadRequest)
		repo.UpdateStatus(r.Context(), idParam, model.StatusExpired)
		os.RemoveAll(fsPath)
		return false, nil
	}
	return true, nil
}

func exists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err == nil {
		return true, nil
	}
	if errors.Is(err, fs.ErrNotExist) {
		return false, nil
	}
	return false, err
}

func saveFilesFromForm(cfg *UploadConfig, newEntry model.UploadInfo, files []*multipart.FileHeader, w http.ResponseWriter) bool {
	filesDir := path.Join(cfg.FilesPath, newEntry.ID)
	os.MkdirAll(filesDir, os.ModePerm)

	for _, fileHeader := range files {

		file, err := fileHeader.Open()
		if err != nil {
			http.Error(w, "Unable to open file", http.StatusInternalServerError)
			return false
		}
		defer file.Close()

		destPath := filepath.Join(filesDir, fileHeader.Filename)
		destFile, err := os.Create(destPath)
		if err != nil {
			http.Error(w, "Unable to create file", http.StatusInternalServerError)
			return false
		}
		defer destFile.Close()

		_, err = io.Copy(destFile, file)
		if err != nil {
			http.Error(w, "Unable to save file", http.StatusInternalServerError)
			return false
		}
	}
	return true
}

func getInfoForUpload(cfg *UploadConfig, entry model.UploadInfo, w http.ResponseWriter) (model.DownloadInfo, bool) {
	if entry.STATUS != model.StatusActive {
		var emptyInfo model.DownloadInfo
		emptyInfo.METADATA = entry
		return emptyInfo, true
	}

	filesDir := path.Join(cfg.FilesPath, entry.ID)
	entries, err := os.ReadDir(filesDir)
	if err != nil {
		http.Error(w, "Failed to read files", http.StatusInternalServerError)
		return model.DownloadInfo{}, false
	}
	var dlInfo model.DownloadInfo
	for _, e := range entries {
		fileInfo, err := createFileInfo(e)
		if err != nil {
			http.Error(w, "Failed to read files", http.StatusInternalServerError)
			return model.DownloadInfo{}, false
		}
		dlInfo.FILES = append(dlInfo.FILES, fileInfo)
	}
	dlInfo.METADATA = entry
	return dlInfo, true
}

func createFileInfo(e fs.DirEntry) (model.FileInfo, error) {
	var info model.FileInfo

	fileInfo, err := e.Info()
	if err != nil {
		return info, err
	}
	humanSize := humanize.Bytes(uint64(fileInfo.Size()))

	info.FILENAME = e.Name()
	info.SIZE = humanSize

	return info, nil
}
