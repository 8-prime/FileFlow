import { DownloadInfo, Stats } from "@/models/models"
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
