import { useEffect, useState } from "react"
import { ChevronDown, Copy, FileIcon, MoreHorizontal, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { NavLink } from "react-router"
import { useDownloadInfos, useStats } from "@/api/api"
import { Header } from "@/components/Header"
import { Skeleton } from "@/components/ui/skeleton"
import { DownloadInfo, FileInfo } from "@/models/models"


export default function Admin() {
    const stats = useStats()
    const downloads = useDownloadInfos(0)

    useEffect(() => {
        console.log(stats);

    }, [stats])

    const copyLink = (id: string) => {
        const link = `${window.location.origin}/download/${id}`
        navigator.clipboard.writeText(link)
        toast("Link copied", {
            description: "The download link has been copied to your clipboard.",
        })
    }

    const deleteUpload = (id: string) => {
        // setUploads(uploads.filter((upload) => upload.id !== id))
        // toast("Upload deleted", {
        //     description: "The upload and all its files have been permanently deleted.",
        // })
    }


    return (
        <div className="grow flex flex-col">
            <Header />
            <main className="w-full flex flex-col justify-center items-center px-4">
                <div className="container py-6 md:py-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                        <Button asChild>
                            <NavLink to="/">Upload New Files</NavLink>
                        </Button>
                    </div>

                    <Tabs defaultValue="all" className="mt-6">
                        <TabsList>
                            <TabsTrigger value="all">All Uploads</TabsTrigger>
                            <TabsTrigger value="active">Active</TabsTrigger>
                            <TabsTrigger value="expired">Expired</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all" className="mt-4">
                            <UploadTable uploads={downloads.downloadInfos} onCopyLink={copyLink} onDeleteUpload={deleteUpload} />
                        </TabsContent>
                        <TabsContent value="active" className="mt-4">
                            <UploadTable
                                uploads={downloads.downloadInfos.filter((upload) => upload.metadata.status === "active")}
                                onCopyLink={copyLink}
                                onDeleteUpload={deleteUpload}
                            />
                        </TabsContent>
                        <TabsContent value="expired" className="mt-4">
                            <UploadTable
                                uploads={downloads.downloadInfos.filter((upload) => upload.metadata.status === "expired")}
                                onCopyLink={copyLink}
                                onDeleteUpload={deleteUpload}
                            />
                        </TabsContent>
                    </Tabs>

                    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle>Total Uploads</CardTitle>
                                <CardDescription>All time file uploads</CardDescription>
                            </CardHeader>
                            {stats.isLoading &&
                                <Skeleton className="w-full" />
                            }
                            {!stats.isLoading &&
                                <CardContent>
                                    <div className="text-4xl font-bold">{stats?.stats?.totalUploads}</div>
                                </CardContent>
                            }
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle>Active Files</CardTitle>
                                <CardDescription>Files available for download</CardDescription>
                            </CardHeader>
                            {stats.isLoading &&
                                <Skeleton className="w-full" />
                            }
                            {!stats.isLoading &&
                                <CardContent>
                                    <div className="text-4xl font-bold">{stats?.stats?.activeDownloads}</div>
                                </CardContent>
                            }
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle>Total Downloads</CardTitle>
                                <CardDescription>All time file downloads</CardDescription>
                            </CardHeader>
                            {stats.isLoading &&
                                <Skeleton className="w-full" />
                            }
                            {!stats.isLoading &&
                                <CardContent>
                                    <div className="text-4xl font-bold">{stats?.stats?.totalDownloads}</div>
                                </CardContent>
                            }
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}

function UploadTable({
    uploads,
    onCopyLink,
    onDeleteUpload,
}: Readonly<{
    uploads: DownloadInfo[]
    onCopyLink: (id: string) => void
    onDeleteUpload: (id: string) => void
}>) {
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

    const formatDate = (dateString: number) => {
        return new Date(dateString * 1000).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const humanizeBytes = (bytes: number, decimals: number = 2) => {
        const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const base = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, base)).toFixed(decimals) + " " + units[base];
    }

    const toggleRow = (id: string) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const getTotalSize = (files: FileInfo[]) => {
        //FIXME: Actually parse the sizes properly
        const totalMB = files?.reduce((total, file) => {
            const size = Number.parseFloat(file.size.replace(" MB", ""))
            return total + size
        }, 0)

        return `${totalMB?.toFixed(1)} MB`
    }

    const getUploadTitle = (files: FileInfo[]) => {
        if (files.length === 0) return "No files ..."
        if (files.length === 1) return files[0].filename
        return `${files[0].filename}, ...`
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[30px]"></TableHead>
                        <TableHead>Upload ID</TableHead>
                        <TableHead className="hidden md:table-cell">Files</TableHead>
                        <TableHead className="hidden md:table-cell">Size</TableHead>
                        <TableHead className="hidden md:table-cell">Uploaded</TableHead>
                        <TableHead className="hidden md:table-cell">Expires</TableHead>
                        <TableHead>Downloads</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {uploads.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                                No uploads found
                            </TableCell>
                        </TableRow>
                    ) : (
                        uploads.map((upload) => (
                            <>
                                <TableRow
                                    key={upload.metadata.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => toggleRow(upload.metadata.id)}
                                >
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                                            <ChevronDown
                                                className={`h-4 w-4 transition-transform ${expandedRows[upload.metadata.id] ? "rotate-180" : ""}`}
                                            />
                                        </Button>
                                    </TableCell>
                                    <TableCell className="font-medium">{getUploadTitle(upload.files ?? [])}</TableCell>
                                    <TableCell className="hidden md:table-cell">{upload?.files?.length ?? '-'}</TableCell>
                                    <TableCell className="hidden md:table-cell">{getTotalSize(upload.files)}</TableCell>
                                    <TableCell className="hidden md:table-cell">{formatDate(upload.metadata.uploaded)}</TableCell>
                                    <TableCell className="hidden md:table-cell">{formatDate(upload.metadata.expires)}</TableCell>
                                    <TableCell>
                                        {upload.metadata.currentDownloads}/{upload.metadata.maxDownloads === -1 ? "∞" : upload.metadata.maxDownloads}
                                    </TableCell>
                                    <TableCell>
                                        <div
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${upload.metadata.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {upload.metadata.status === "active" ? "Active" : "Expired"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onCopyLink(upload.metadata.id)}>
                                                    <Copy className="mr-2 h-4 w-4" />
                                                    Copy Link
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => onDeleteUpload(upload.metadata.id)}
                                                    className="text-red-600 focus:text-red-600"
                                                >
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Delete Upload
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                                {expandedRows[upload.metadata.id] && (
                                    <TableRow className="bg-muted/50">
                                        <TableCell colSpan={9} className="p-0">
                                            <div className="px-4 py-2">
                                                <h4 className="font-medium mb-2">Files in this upload:</h4>
                                                <div className="grid gap-2">
                                                    {upload.files.map((file) => (
                                                        <div
                                                            key={file.filename}
                                                            className="flex items-center justify-between py-1 px-2 rounded-md bg-background"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <FileIcon className="h-4 w-4 text-muted-foreground" />
                                                                <span>{file.filename}</span>
                                                                <span className="text-xs text-muted-foreground">({file.size})</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}