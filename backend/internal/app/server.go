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
	})
}
