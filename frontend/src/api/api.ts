import { DownloadInfo, Stats, UploadInfo } from "@/models/models"
import useSWR from 'swr'


const statsFetcher = async () => {
    const result = await fetch('api/stats')
    if (!result.ok) {
        throw new Error(result.statusText)
    }
    return await result.json() as Stats
}

export const useStats = () => {
    const { data, error, isLoading } = useSWR(statsFetcher)
    return {
        stats: data,
        isLoading,
        isError: error
    }
}

export const downloadInfoFetcher = async (id: string) => {
    console.log("calling backend")
    const result = await fetch(`/api/upload/${id}`)
    console.log("got result from backend")
    if (!result.ok) {
        throw new Error(result.statusText)
    }
    return await result.json() as DownloadInfo
}

export const useDownloadInfo = (id: string | undefined) => {
    if (!id) {
        return {
            downloadInfo: undefined,
            isLoading: false,
            isError: true
        }
    }
    const { data, error, isLoading } = useSWR(id, downloadInfoFetcher)
    return {
        downloadInfo: data,
        isLoading,
        isError: error
    }
}

export type UploadCallbacks = {
    onProgress: (progress: number) => void;
    onSuccess: (response: UploadInfo) => void;
    onError: (error: string) => void;
    onAbort?: (message: string) => void; // Optional abort callback
}

export const uploadFilesWithCallbacks = async (
    files: File[],
    expiration: string,
    maxDownloads: number,
    callbacks: UploadCallbacks
): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (!files || files.length === 0) {
            callbacks.onError("No files selected.");
            reject("No files selected");
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }

        formData.append("expiration", expiration)
        formData.append("maxDownloads", maxDownloads.toString())

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
                const progress = Math.round((event.loaded / event.total) * 100);
                callbacks.onProgress(progress);
            }
        });

        xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const parsedResponse: UploadInfo = JSON.parse(xhr.responseText);
                    callbacks.onSuccess(parsedResponse);
                    resolve(parsedResponse);
                } catch (error: any) {
                    // Handle JSON parsing errors
                    callbacks.onError(`Error parsing JSON response: ${error.message}`);
                    reject(`Error parsing JSON response: ${error.message}`);
                }
            } else {
                callbacks.onError(`Upload failed with status: ${xhr.status}`);
                reject(`Upload failed with status: ${xhr.status}`);
            }
        });

        xhr.addEventListener("error", () => {
            callbacks.onError("Network error during upload.");
            reject("Network error during upload.");
        });

        xhr.addEventListener("abort", () => {
            callbacks.onAbort?.("Upload aborted."); // Use optional chaining
            reject("Upload aborted.");
        });

        xhr.open("POST", "/api/upload");
        xhr.send(formData);
    });
}

