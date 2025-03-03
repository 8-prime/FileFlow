package app

import (
	"backend/internal/handler"
	"backend/internal/repository"

	"github.com/go-chi/chi"
)

func (app *Application) RegisterRoutes() {
	repo := repository.NewRepository(app.DB)
	app.Router.Route("/api", func(r chi.Router) {
		r.Get("/health", app.healthCheckHandler)

		// Example resource
		r.Route("/stats", func(r chi.Router) {
			r.Get("/", handler.HandleGetStats(repo))
		})

		r.Route("/upload", func(r chi.Router) {
			r.Post("/", handler.HandleUpload(repo, &app.Config.SERVER))
			r.Get("/{id}", handler.GetDownloadInfo(repo, &app.Config.SERVER))
			r.Get("/{id}/{file}", handler.GetFile(repo, &app.Config.SERVER))
			r.Delete("/{id}", handler.SoftDeleteEntry(repo, &app.Config.SERVER))
		})

		r.Route("/uploads", func(r chi.Router) {
			r.Get("/", handler.GetUploads(repo, &app.Config.SERVER))
		})

	})
}
