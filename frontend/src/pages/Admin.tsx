import { useState } from "react"
import { Copy, MoreHorizontal, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { NavLink } from "react-router"

// Mock data for demonstration
const mockFiles = [
    {
        id: "file1",
        name: "presentation.pptx",
        size: "4.2 MB",
        uploadedAt: "2023-06-12T10:30:00Z",
        expiresAt: "2023-06-19T10:30:00Z",
        downloads: 3,
        maxDownloads: 10,
        status: "active",
    },
    {
        id: "file2",
        name: "document.pdf",
        size: "1.8 MB",
        uploadedAt: "2023-06-10T14:15:00Z",
        expiresAt: "2023-06-17T14:15:00Z",
        downloads: 5,
        maxDownloads: 5,
        status: "expired",
    },
    {
        id: "file3",
        name: "image.jpg",
        size: "3.5 MB",
        uploadedAt: "2023-06-11T09:45:00Z",
        expiresAt: "2023-07-11T09:45:00Z",
        downloads: 2,
        maxDownloads: 20,
        status: "active",
    },
    {
        id: "file4",
        name: "spreadsheet.xlsx",
        size: "2.1 MB",
        uploadedAt: "2023-06-09T16:20:00Z",
        expiresAt: "2023-06-16T16:20:00Z",
        downloads: 0,
        maxDownloads: 3,
        status: "active",
    },
    {
        id: "file5",
        name: "archive.zip",
        size: "15.7 MB",
        uploadedAt: "2023-06-08T11:10:00Z",
        expiresAt: "2023-06-15T11:10:00Z",
        downloads: 1,
        maxDownloads: 1,
        status: "expired",
    },
]

export default function Admin() {
    const [files, setFiles] = useState(mockFiles)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const copyLink = (id: string) => {
        const link = `${window.location.origin}/download/${id}`
        navigator.clipboard.writeText(link)
        toast("Link copied", {
            description: "The download link has been copied to your clipboard.",
        })
    }

    const deleteFile = (id: string) => {
        setFiles(files.filter((file) => file.id !== id))
        toast("File deleted", {
            description: "The file has been permanently deleted.",
        })
    }

    return (
        <div className="grow flex flex-col">
            <header className="border-b">
                <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
                    <NavLink to="/" className="font-bold">
                        FileFlow
                    </NavLink>
                    <nav className="ml-auto flex gap-4 sm:gap-6">
                        <NavLink to="/" className="text-sm font-medium">
                            Upload
                        </NavLink>
                        <NavLink to="/admin" className="text-sm font-medium text-primary">
                            Admin
                        </NavLink>
                    </nav>
                </div>
            </header>
            <main className="w-full flex flex-col justify-center items-center">
                <div className="container py-6 md:py-10">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                        <Button asChild>
                            <NavLink to="/">Upload New Files</NavLink>
                        </Button>
                    </div>

                    <Tabs defaultValue="all" className="mt-6">
                        <TabsList>
                            <TabsTrigger value="all">All Files</TabsTrigger>
                            <TabsTrigger value="active">Active</TabsTrigger>
                            <TabsTrigger value="expired">Expired</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all" className="mt-4">
                            <FileTable files={files} onCopyLink={copyLink} onDeleteFile={deleteFile} />
                        </TabsContent>
                        <TabsContent value="active" className="mt-4">
                            <FileTable
                                files={files.filter((file) => file.status === "active")}
                                onCopyLink={copyLink}
                                onDeleteFile={deleteFile}
                            />
                        </TabsContent>
                        <TabsContent value="expired" className="mt-4">
                            <FileTable
                                files={files.filter((file) => file.status === "expired")}
                                onCopyLink={copyLink}
                                onDeleteFile={deleteFile}
                            />
                        </TabsContent>
                    </Tabs>

                    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle>Total Uploads</CardTitle>
                                <CardDescription>All time file uploads</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">{files.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle>Active Files</CardTitle>
                                <CardDescription>Files available for download</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">{files.filter((file) => file.status === "active").length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle>Total Downloads</CardTitle>
                                <CardDescription>All time file downloads</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">{files.reduce((total, file) => total + file.downloads, 0)}</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}

function FileTable({
    files,
    onCopyLink,
    onDeleteFile,
}: {
    files: typeof mockFiles
    onCopyLink: (id: string) => void
    onDeleteFile: (id: string) => void
}) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Size</TableHead>
                        <TableHead className="hidden md:table-cell">Uploaded</TableHead>
                        <TableHead className="hidden md:table-cell">Expires</TableHead>
                        <TableHead>Downloads</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {files.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                No files found
                            </TableCell>
                        </TableRow>
                    ) : (
                        files.map((file) => (
                            <TableRow key={file.id}>
                                <TableCell className="font-medium">{file.name}</TableCell>
                                <TableCell className="hidden md:table-cell">{file.size}</TableCell>
                                <TableCell className="hidden md:table-cell">{formatDate(file.uploadedAt)}</TableCell>
                                <TableCell className="hidden md:table-cell">{formatDate(file.expiresAt)}</TableCell>
                                <TableCell>
                                    {file.downloads}/{file.maxDownloads === 0 ? "∞" : file.maxDownloads}
                                </TableCell>
                                <TableCell>
                                    <div
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${file.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {file.status === "active" ? "Active" : "Expired"}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onCopyLink(file.id)}>
                                                <Copy className="mr-2 h-4 w-4" />
                                                Copy Link
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => onDeleteFile(file.id)}
                                                className="text-red-600 focus:text-red-600"
                                            >
                                                <Trash className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}