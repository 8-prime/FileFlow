package handler

import (
	"backend/internal/repository"
	"encoding/json"
	"net/http"
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
