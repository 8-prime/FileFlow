import type React from "react"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router"
import FileUploadStep from "./FileUploadStep"
import FileConfigurationStep from "./FileConfigurationStep"
import { Progress } from "./ui/progress"
import { UploadInfo } from "@/models/models"
import { toast } from "sonner"
import { uploadFilesWithCallbacks } from "@/api/api"

export function FileUpload() {
    const [uploading, setUploading] = useState<boolean>(false)
    const [progress, setProgress] = useState<number>(0)

    const navigate = useNavigate();
    const [step, setStep] = useState<"upload" | "configure">("upload")
    const [files, setFiles] = useState<File[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [downloadLimit, setDownloadLimit] = useState(1)
    const [expiration, setExpiration] = useState("1d")

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files)
            setFiles([...files, ...newFiles])
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("changed")
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files)
            setFiles([...files, ...newFiles])
        }
    }

    const removeFile = (index: number) => {
        const newFiles = [...files]
        newFiles.splice(index, 1)
        setFiles(newFiles)
    }

    const handleContinue = () => {
        if (files.length > 0) {
            setStep("configure")
        }
    }

    const onUploadComplete = (uploadInfo: UploadInfo) => {
        setUploading(false)
        navigate(`/success/${uploadInfo.id}`)
    }

    const onErrorOrAbort = (message: string) => {
        setUploading(false)
        toast("Uploading fialed", {
            description: message,
        })
    }

    const onProgress = (progress: number) => {
        setProgress(progress)

    }

    const handleUpload = () => {
        uploadFilesWithCallbacks(files, expiration, downloadLimit, {
            onError: onErrorOrAbort,
            onProgress: onProgress,
            onSuccess: onUploadComplete,
            onAbort: onErrorOrAbort
        })
    }
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{step === "upload" ? "Upload Files" : "Configure Sharing"}</CardTitle>
                <CardDescription>
                    {step === "upload"
                        ? "Drag and drop your files or click to browse"
                        : "Set download limits and expiration for your files"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {step === "upload" ? (
                    <FileUploadStep
                        files={files}
                        handleDragLeave={handleDragLeave}
                        handleDragOver={handleDragOver}
                        handleDrop={handleDrop}
                        handleFileChange={handleFileChange}
                        isDragging={isDragging}
                        removeFile={removeFile}
                    />
                ) : (
                    <FileConfigurationStep
                        files={files}
                        downloadLimit={downloadLimit}
                        expiration={expiration}
                        setDownloadLimit={setDownloadLimit}
                        setExpiration={setExpiration}
                    />
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                {step === "upload" ? (
                    <Button onClick={handleContinue} disabled={files.length === 0} className="w-full">
                        Continue
                    </Button>
                ) : (
                    <>
                        {
                            !uploading &&
                            <>
                                <Button variant="outline" onClick={() => setStep("upload")}>
                                    Back
                                </Button>
                                <Button onClick={handleUpload}>Upload and Share</Button>
                            </>
                        }
                        {
                            uploading &&
                            <div className="flex flex-col w-full">
                                <Progress value={progress} />
                            </div>
                        }
                    </>
                )}
            </CardFooter>
        </Card>
    )
}
