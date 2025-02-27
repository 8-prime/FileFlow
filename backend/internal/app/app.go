package app

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"backend/internal/database"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
)

// Config holds application configuration
type Config struct {
	DB      database.Config
	Port    string
	Timeout time.Duration
}

// Application holds the dependencies for the API
type Application struct {
	DB     *sql.DB
	Router *chi.Mux
	Config Config
}

func NewApplication(cfg Config) (*Application, error) {
	// Initialize database using the database package
	db, err := database.InitDB(cfg.DB)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize database: %w", err)
	}

	// Initialize router with middleware
	router := chi.NewRouter()

	// Add middleware
	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(middleware.Timeout(cfg.Timeout))

	app := &Application{
		DB:     db,
		Router: router,
		Config: cfg,
	}

	return app, nil
}

func (app *Application) Start() error {
	server := &http.Server{
		Addr:         ":" + app.Config.Port,
		Handler:      app.Router,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	// Channel to listen for errors coming from the server
	serverErrors := make(chan error, 1)

	// Start the server
	go func() {
		log.Printf("Server listening on %s", server.Addr)
		serverErrors <- server.ListenAndServe()
	}()

	// Channel to listen for an interrupt or terminate signal
	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, os.Interrupt, syscall.SIGTERM)

	// Block until we receive a signal or error
	select {
	case err := <-serverErrors:
		return fmt.Errorf("server error: %w", err)

	case <-shutdown:
		log.Println("Shutting down server gracefully...")

		// Create a deadline for the shutdown
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		// Try to shut down gracefully
		if err := server.Shutdown(ctx); err != nil {
			// Force close if graceful shutdown fails
			server.Close()
			return fmt.Errorf("could not stop server gracefully: %w", err)
		}

		// Close database connection
		if err := app.DB.Close(); err != nil {
			return fmt.Errorf("failed to close database: %w", err)
		}

		log.Println("Server stopped gracefully")
	}

	return nil
}
