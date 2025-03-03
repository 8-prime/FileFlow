import { useDownloadInfo } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Download } from "lucide-react";
import { JSX, useMemo } from "react";
import { useParams } from "react-router";

const FileView = (): JSX.Element => {
    const { uploadId } = useParams()
    const { downloadInfo, isError, isLoading } = useDownloadInfo(uploadId)
    const remainingDownloads = useMemo(() => {
        if (!downloadInfo) return undefined
        return downloadInfo.metadata.maxDownloads - downloadInfo.metadata.currentDownloads
    }, [downloadInfo])

    const expiration = useMemo(() => {
        if (!downloadInfo) return;
        const lang = navigator.language
        const date = new Date(downloadInfo.metadata.expires * 1000);
        return date.toLocaleDateString(lang);
    }, [downloadInfo])

    const getUrlEncodedHref = (file: string) => {
        return `/api/upload/${uploadId}/${encodeURIComponent(file)}`
    }


    return (
        <div className="grow w-full flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Download File{remainingDownloads !== 1 && "s"}</CardTitle>
                    <CardDescription>
                        {(isLoading || isError) &&
                            <Skeleton className="h-4 w-[250px]" />
                        }
                        {!isLoading && !isError && !!remainingDownloads &&
                            <p>
                                You can download this file {remainingDownloads} more time{remainingDownloads !== 1 && "s"}
                            </p>
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {(isLoading || isError) &&
                        <div className="rounded-md bg-muted p-4">
                            <div className="flex items-center space-x-4 gap-4">
                                <Skeleton className="grow h-4" />
                                <Skeleton className="h-4 w-4 rounded-full" />
                            </div>
                        </div>
                    }
                    {downloadInfo?.files.map(f =>
                        <div key={f.filename} className="rounded-md bg-muted p-4">
                            <div className="flex items-center space-x-4">
                                <div className="grow">
                                    <p className="font-medium">{f.filename}</p>
                                    <p className="text-sm text-muted-foreground">{f.size}</p>
                                </div>
                                <a href={getUrlEncodedHref(f.filename)} download className="rounded-full bg-primary/10 p-2">
                                    <Download className="h-6 w-6 text-primary" />
                                </a>
                            </div>
                        </div>
                    )}

                    <div className="text-sm text-muted-foreground">
                        <p>This upload will expire on {expiration}</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" size="lg">
                        <Download className="mr-2 h-4 w-4" />
                        Download all files as archive
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default FileView;