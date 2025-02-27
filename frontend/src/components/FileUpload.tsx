import type React from "react"

import { useState } from "react"
import { FileUpIcon, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useNavigate } from "react-router"
import FileUploadStep from "./FileUploadStep"
import FileConfigurationStep from "./FileConfigurationStep"









export function FileUpload() {
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

    const handleUpload = () => {
        // Here you would implement the actual file upload logic
        // For now, we'll just simulate a successful upload and redirect
        console.log("Uploading files:", files)
        console.log("Download limit:", downloadLimit)
        console.log("Expiration:", expiration)

        // Simulate upload and redirect to success page
        navigate("/success/123")
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
                        <Button variant="outline" onClick={() => setStep("upload")}>
                            Back
                        </Button>
                        <Button onClick={handleUpload}>Upload and Share</Button>
                    </>
                )}
            </CardFooter>
        </Card>
    )
}
