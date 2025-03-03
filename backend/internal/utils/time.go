package utils

import (
	"fmt"
	"math"
	"strconv"
	"strings"
	"time"
)

func ParseDurationToTime(durationStr string) (int64, error) {
	durationStr = strings.ToLower(durationStr)

	if durationStr == "never" {
		return math.MaxInt64, nil // Return zero time for "never"
	}

	if strings.HasSuffix(durationStr, "h") {
		hoursStr := strings.TrimSuffix(durationStr, "h")
		hours, err := strconv.Atoi(hoursStr)
		if err != nil {
			return 0, fmt.Errorf("invalid hours value: %w", err)
		}
		return time.Now().UTC().Add(time.Hour * time.Duration(hours)).Unix(), nil
	}

	if strings.HasSuffix(durationStr, "d") {
		daysStr := strings.TrimSuffix(durationStr, "d")
		days, err := strconv.Atoi(daysStr)
		if err != nil {
			return 0, fmt.Errorf("invalid days value: %w", err)
		}
		return time.Now().UTC().AddDate(0, 0, days).Unix(), nil
	}

	return 0, fmt.Errorf("invalid duration format: %s", durationStr)
}
