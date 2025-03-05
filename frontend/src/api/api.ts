import { DownloadInfo, Stats, UploadInfo } from "@/models/models";
import useSWR, { KeyedMutator } from 'swr';
import axios, { AxiosResponse } from "axios";


const statsFetcher = async () => {
    const result = await fetch('api/stats')
    if (!result.ok) {
        throw new Error(result.statusText)
    }
    const fetchedResult = await result.json() as Stats
    return fetchedResult
}

export type useStatsData = {
    stats: Stats | undefined,
    isLoading: boolean,
    error: Error,
    mutate: KeyedMutator<any>
}

export const useStats = (): useStatsData => {
    const { data, error, isLoading, mutate } = useSWR("/api/stats", statsFetcher)
    return {
        stats: data,
        isLoading,
        error,
        mutate
    }
}

export const downloadInfoFetcher = async (id: string) => {
    const result = await fetch(`/api/upload/${id}`)
    if (!result.ok) {
        const errorText = await result.text();
        throw new Error(errorText)
    }
    return await result.json() as DownloadInfo
}

export type useDownloadInfoData = {
    downloadInfo: DownloadInfo | undefined,
    isLoading: boolean,
    error: Error | undefined
}

export const useDownloadInfo = (id: string | undefined): useDownloadInfoData => {
    if (!id) {
        return {
            downloadInfo: undefined,
            isLoading: false,
            error: undefined
        }
    }
    const { data, error, isLoading } = useSWR(id, downloadInfoFetcher)
    return {
        downloadInfo: data,
        isLoading,
        error
    }
}

export const downloadInfosFetcher = async (page: number) => {
    const result = await fetch(`/api/uploads/?page=${page}`)
    if (!result.ok) {
        throw new Error(result.statusText)
    }
    return await result.json() as DownloadInfo[]
}

export type useDownloadInfosData = {
    downloadInfos: DownloadInfo[],
    isLoading: boolean,
    error: Error,
    mutate: KeyedMutator<any>
}

export const useDownloadInfos = (page: number | undefined): useDownloadInfosData => {
    const { data, error, isLoading, mutate } = useSWR(page?.toString(), () => downloadInfosFetcher(page ?? 0))
    return {
        downloadInfos: data ?? [],
        isLoading,
        error,
        mutate
    }
}

export async function softDelete(id: string): Promise<boolean> {
    const response = await fetch(`/api/upload/${id}`, { method: 'DELETE' })
    return response.ok
}

export async function uploadFiles(
    files: File[],
    expiration: string,
    maxDownloads: number,
    progressCallback: (progress: number) => void,
): Promise<UploadInfo> {
    const formData = new FormData();

    files.forEach((file) => {
        formData.append("files", file);
    });

    formData.append("expiration", expiration);
    formData.append("maxDownloads", String(maxDownloads));

    try {
        const response: AxiosResponse<UploadInfo> = await axios.post(
            "/api/upload",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total ?? Number.MAX_VALUE),
                    );
                    progressCallback(progress);
                },
            },
        );

        return response.data;
    } catch (error: any) {
        throw new Error(`File upload failed: ${error.message}`);
    }
}