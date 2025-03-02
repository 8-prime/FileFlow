package model

type Stats struct {
	TOTAL_UPLOADS    int64 `json:"totalUploads"`
	ACTIVE_DOWNLOADS int64 `json:"activeDownloads"`
	TOTAL_DOWNLOADS  int64 `json:"totalDownloads"`
}

type Status string

const (
	StatusActive  Status = "active"
	StatusExpired Status = "expired"
	StatusDeleted Status = "deleted"
)

type UploadInfo struct {
	ID                string `json:"id"`
	MAX_DOWNLOADS     int64  `json:"maxDownloads"`
	CURRENT_DOWNLOADS int64  `json:"currentDownloads"`
	UPLOADED          int64  `json:"uploaded"`
	EXPIRES           int64  `json:"expires"`
	STATUS            Status `json:"status"`
}

type DownloadInfo struct {
	FILES    []string   `json:"files"`
	METADATA UploadInfo `json:"metadata"`
}

type DownloadRequest struct {
	FILE string `json:"file"`
}
