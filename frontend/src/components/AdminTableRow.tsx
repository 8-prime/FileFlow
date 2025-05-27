import { DownloadInfo, FileInfo } from "@/models/models"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { TableCell, TableRow } from "./ui/table"
import { Button } from "./ui/button"
import { ChevronDown, FileIcon, Settings2, Trash2 } from "lucide-react"
import { CopyButton } from "./CopyButton"
import { useState } from "react"
import { UploadConfiguration } from "./FileConfigurationStep"
import { maxFileDownloadLimit } from "./FileUpload"


export type AdminTableRowProps = {
    upload: DownloadInfo
    toggleRow: (id: string) => void
    expandedRows: Record<string, boolean>
}

export function AdminTableRow({ upload, toggleRow, expandedRows }: AdminTableRowProps) {
    const [newDownloadLimit, setNewDownloadLimit] = useState<number>(upload.metadata.maxDownloads == -1 ? maxFileDownloadLimit : upload.metadata.maxDownloads)
    const [newExpiration, setNewExpiration] = useState<string>("never")

    const update = () => {
        console.log(`updating upload ${upload.metadata.id}`);
    }


    const formatDate = (dateString: number) => {
        if (dateString === -1) {
            return "Never"
        }
        return new Date(dateString * 1000).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
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

    const openEditDialog = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        setNewDownloadLimit(upload.metadata.maxDownloads == -1 ? maxFileDownloadLimit : upload.metadata.maxDownloads)
        setNewExpiration("never")//TODO: Set expiration properly. Need to change backend
    }

    return (
        <Dialog key={upload.metadata.id}>
            <TableRow
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
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${upload.metadata.status === "active" ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"
                            }`}
                    >
                        {upload.metadata.status === "active" ? "Active" : "Expired"}
                    </div>
                </TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                    <CopyButton variant="secondary" text={`${window.location.origin}/files/${upload.metadata.id}`}>
                    </CopyButton>
                    <DialogTrigger asChild>
                        <Button variant="secondary" onClick={(e) => openEditDialog(e)}><Settings2 /></Button>
                    </DialogTrigger>
                    <Button variant="destructive">
                        <Trash2 />
                    </Button>
                </TableCell>
            </TableRow>
            {expandedRows[upload.metadata.id] && (
                <TableRow className="bg-muted/50">
                    <TableCell colSpan={9} className="p-0">
                        <div className="px-4 py-2">
                            <h4 className="font-medium mb-2">Files in this upload:</h4>
                            <div className="grid gap-2">
                                {upload.files?.map((file) => (
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
            <DialogContent className="sm:max-w-[425px]">
                <h1 className="text-3xl font-semibold">Edit Upload settings</h1>
                <UploadConfiguration downloadLimit={newDownloadLimit} expiration={newExpiration} setDownloadLimit={setNewDownloadLimit} setExpiration={setNewExpiration} />
                <Button onClick={update}>Update</Button>
            </DialogContent>
        </Dialog>
    )
}