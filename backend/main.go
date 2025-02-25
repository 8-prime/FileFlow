package main

import (
	"backend/database"
	"context"
	"log"
)

func main() {
	db, err := database.New("./data.db")
	if err != nil {
		log.Fatalf("failed to open database: %w", err)
	}

	_, err = db.DB.ExecContext(
		context.Background(),
		`CREATE TABLE IF NOT EXISTS test (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			artist TEXT NOT NULL,
		)`,
	)
	if err != nil {
		log.Fatal("Failed to create table")
	}
	// r := chi.NewRouter()
	// r.Use(middleware.Logger)
	// r.Get("/", func(w http.ResponseWriter, r *http.Request) {
	// 	w.Write([]byte("welcome"))
	// })
	// http.ListenAndServe(":3000", r)
}
