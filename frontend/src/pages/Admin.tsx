import { useState } from "react"
import { ChevronDown, FileIcon, Settings2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NavLink } from "react-router"
import { useDownloadInfos, useStats } from "@/api/api"
import { Header } from "@/components/Header"
import { Skeleton } from "@/components/ui/skeleton"
import { DownloadInfo, FileInfo } from "@/models/models"
import { CopyButton } from "@/components/CopyButton"
import React from "react"
import { UploadEditDialog } from "@/components/UploadEditDialog"
import { Dialog } from "@/components/ui/dialog"
import { AdminTableRow } from "@/components/AdminTableRow"


export default function Admin() {
    const stats = useStats()
    const downloads = useDownloadInfos(0)

    const deleteUpload = (_: string) => {
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

                    <Tabs defaultValue="active" className="mt-6">
                        <TabsList>
                            <TabsTrigger value="active">Active</TabsTrigger>
                            <TabsTrigger value="expired">Expired</TabsTrigger>
                            <TabsTrigger value="all">All Uploads</TabsTrigger>
                        </TabsList>
                        <TabsContent value="active" className="mt-4">
                            <UploadTable
                                uploads={downloads.downloadInfos.filter((upload) => upload.metadata.status === "active")}
                                onDeleteUpload={deleteUpload}
                            />
                        </TabsContent>
                        <TabsContent value="expired" className="mt-4">
                            <UploadTable
                                uploads={downloads.downloadInfos.filter((upload) => upload.metadata.status === "expired")}
                                onDeleteUpload={deleteUpload}
                            />
                        </TabsContent>
                        <TabsContent value="all" className="mt-4">
                            <UploadTable
                                uploads={downloads.downloadInfos}
                                onDeleteUpload={deleteUpload} />
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
    onDeleteUpload,
}: Readonly<{
    uploads: DownloadInfo[]
    onDeleteUpload: (id: string) => void
}>) {
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

    const toggleRow = (id: string) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
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
                        <TableHead className="text-left">Actions</TableHead>
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
                            <AdminTableRow expandedRows={expandedRows} toggleRow={toggleRow} upload={upload} />
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}