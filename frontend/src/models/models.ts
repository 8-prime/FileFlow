export type UploadInfo = {
    id: string,
    maxDownloads: number,
    currentDownloads: number,
    uploaded: number,
    expires: number,
    status: string
}

export type FileInfo = {
    filename: string,
    size: string
}

export type DownloadInfo = {
    files: FileInfo[],
    metadata: UploadInfo
}

export type Stats = {
    totalUploads: number,
    activeDownloads: number,
    totalDownloads: number
}