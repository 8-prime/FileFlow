package main

import (
	"backend/internal/app"
	"backend/internal/database"
	"backend/internal/handler"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	filePath, found := os.LookupEnv("FS_FILE_PATH")
	if !found {
		log.Fatal("Filepath for data storage not set")
	}
	dbFilePath, found := os.LookupEnv("DB_FILE_PATH")
	if !found {
		log.Fatal("Filepath for database not set")
	}
	port, found := os.LookupEnv("PORT")
	if !found {
		log.Fatal("Port for server not specified")
	}

	dbConfig := database.Config{
		DBPath:      dbFilePath,
		MaxConns:    10,
		IdleTimeout: 5 * time.Minute,
	}

	serverConfig := handler.UploadConfig{
		FilesPath: filePath,
	}

	// Create application config
	appConfig := app.Config{
		SERVER:  serverConfig,
		DB:      dbConfig,
		Port:    port,
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
