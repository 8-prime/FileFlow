import { X } from "lucide-react"
import { JSX } from "react"

export type SelectedFileProps = {
    files: File[],
    fileRemoved: (filename: string) => void
}

const FileDisplay = ({ files, fileRemoved }: SelectedFileProps): JSX.Element => {
    return (
        <div className="flex flex-col divide-y-2 divide-neutral-500 w-full">
            {files.map(f =>
                <div key={f.name}
                    className="flex flex-row justify-between first:rounded-t-lg last:rounded-b-lg bg-neutral-800 py-4 px-2 ">
                    <span>{f.name}</span>
                    <button className="cursor-pointer" onClick={() => fileRemoved(f.name)}>
                        <X />
                    </button>
                </div>
            )}
        </div>
    )
}
export default FileDisplay