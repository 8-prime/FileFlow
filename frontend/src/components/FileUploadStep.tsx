import { Label } from "@radix-ui/react-label";
import { Upload, X } from "lucide-react";
import { Button } from "./ui/button";
import { useRef } from "react";


export type FileUploadStepProps = {
    handleDragOver: (e: React.DragEvent) => void,
    handleDragLeave: (e: React.DragEvent) => void,
    handleDrop: (e: React.DragEvent) => void,
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    files: File[],
    removeFile: (index: number) => void,
    isDragging: boolean
}

const FileUploadStep = ({ handleDragOver, handleDragLeave, handleDrop, handleFileChange, files, removeFile, isDragging }: FileUploadStepProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <div
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >

                <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">Drag and drop your files here</p>
                <p className="text-xs text-muted-foreground mb-4">or</p>
                <Label onClick={() => inputRef.current?.click()} htmlFor="file-upload" className="cursor-pointer">
                    <span className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                        Browse Files
                    </span>
                    <input value={[]} className="hidden" ref={inputRef} type="file" multiple onChange={handleFileChange} />
                    {/* <Input id="file-upload" type="file" multiple className="sr-only" onChange={handleFileChange} /> */}
                </Label>
            </div>

            {files.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-sm font-medium mb-2">Selected Files ({files.length})</h3>
                    <ul className="space-y-2">
                        {files.map((file, index) => (
                            <li key={index} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                                <div className="flex items-center">
                                    <span className="truncate max-w-[200px]">{file.name}</span>
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </span>
                                </div>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeFile(index)}>
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Remove file</span>
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}

export default FileUploadStep