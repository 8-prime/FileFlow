import {
    Dialog,
    DialogContent, DialogTrigger
} from "@/components/ui/dialog"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { UploadConfiguration } from "./FileConfigurationStep"
import { useState } from "react"
import { Button } from "./ui/button"


export type UploadEditDialogProps = {
    downloadLimit: number,
    expiration: string,
    uploadId: string
}

export function UploadEditDialog({ downloadLimit, expiration, uploadId }: UploadEditDialogProps) {


    const [newDownloadLimit, setNewDownloadLimit] = useState<number>(downloadLimit)
    const [newExpiration, setNewExpiration] = useState<string>(expiration)

    const update = () => {
        console.log("updating");
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Edit Upload settings</DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <UploadConfiguration downloadLimit={newDownloadLimit} expiration={newExpiration} setDownloadLimit={setNewDownloadLimit} setExpiration={setNewExpiration} />
                <Button>Update</Button>
            </DialogContent>
        </Dialog>
    )
}
