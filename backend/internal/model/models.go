package model

type Stats struct {
	TOTAL_UPLOADS    int64 `json:"totalUploads"`
	ACTIVE_DOWNLOADS int64 `json:"activeDownloads"`
	TOTAL_DOWNLOADS  int64 `json:"totalDownloads"`
}

// Status represents the state of an item in the system
type Status string

// Status enum values
const (
	StatusActive  Status = "active"
	StatusExpired Status = "expired"
	StatusDeleted Status = "deleted"
)

type UploadInfo struct {
	UPLOADED          int64  `json:"uploaded"`
	EXPIRES           int64  `json:"expires"`
	CURRENT_DOWNLOADS int64  `json:"currentDownloads"`
	MAX_DOWNLOADS     int64  `json:"maxDownloads"`
	STATUS            Status `json:"status"`
}
