package app

import (
	"fmt"
	"net/http"
)

func (app *Application) healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	err := app.DB.Ping()
	if err != nil {
		w.WriteHeader(http.StatusServiceUnavailable)
		fmt.Fprintln(w, "Database connection failed")
		return
	}
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "Service healthy")
}
