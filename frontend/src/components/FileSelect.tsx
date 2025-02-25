import { Plus, Upload } from "lucide-react";
import { JSX, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";

export type FileSelectProps = {
    selectedFiles: (files: File[]) => void
}


const FileSelect = ({ selectedFiles }: FileSelectProps): JSX.Element => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        selectedFiles(acceptedFiles);
    }, [selectedFiles])
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div className="cursor-pointer w-full h-96 flex flex-col p-4 justify-start items-center bg-stone-200 dark:bg-neutral-800 rounded-lg border-dashed border-[1px]" {...getRootProps()}>
            <input
                {...getInputProps()}
            />
            <div className="grow flex flex-col justify-center items-center gap-4">
                <div className="flex flex-col justify-center items-center">
                    <Plus />
                    <p>Drag and drop some files...</p>
                </div>
                <p>or click to select some files</p>
            </div>
        </div>
    )
}

export default FileSelect;