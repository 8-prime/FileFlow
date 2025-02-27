package main

import (
	"backend/internal/app"
	"backend/internal/database"
	"log"
	"time"
)

func main() {
	// Create DB config
	dbConfig := database.Config{
		DBPath:      "./data.db",
		MaxConns:    10,
		IdleTimeout: 5 * time.Minute,
	}

	// Create application config
	appConfig := app.Config{
		DB:      dbConfig,
		Port:    "8080",
		Timeout: 60 * time.Second,
	}

	// Create application
	app, err := app.NewApplication(appConfig)
	if err != nil {
		log.Fatalf("Failed to initialize application: %v", err)
	}

	// Set up routes
	app.RegisterRoutes()

	// Start the server
	if err := app.Start(); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
