export type UploadInfo = {
    id: string,
    maxDownloads: number,
    currentDownloads: number,
    uploaded: number,
    expires: number,
    status: string
}

export type DownloadInfo = {
    files: string[],
    metadata: UploadInfo
}

export type DownloadRequest = {

}

export type Stats = {
    totalUplaods: number,
    activeDownloads: number,
    totalDownloads: number
}