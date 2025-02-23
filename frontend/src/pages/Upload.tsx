import { JSX, useState } from "react"
import FileSelect from "../components/FileSelect";
import FileDisplay from "../components/FileDisplay";

type DownloadLimitProps = {
    limit: number,
    setLimit: (newLimit: number) => void
}

const DownloadLimit = ({ limit, setLimit }: DownloadLimitProps): JSX.Element => {
    return (
        <div className="w-full flex flex-col gap-2">
            <p>Download limit</p>
            <input value={limit} onChange={(e) => setLimit(+e.target.value)} placeholder="Set how often this should be downloadable" className="w-full bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg shadow-lg" type="number" />
        </div>
    )
}


const Upload = (): JSX.Element => {
    const [limit, setLimit] = useState<number>(1)
    const [files, setFiles] = useState<File[]>([])
    const removeSelectedFiles = (file: string) => {
        setFiles(files.filter(f => f.name != file))
    }

    return (
        <div className="grow flex flex-col justify-center items-center px-2 md:px-52 lg:px-96">
            <div className="w-full flex flex-col justify-center items-center gap-4">
                {
                    files.length === 0 &&
                    <FileSelect selectedFiles={setFiles} />
                }
                {
                    files.length > 0 &&
                    <>
                        <FileDisplay files={files} fileRemoved={removeSelectedFiles} />
                        <DownloadLimit limit={limit} setLimit={setLimit} />

                        <button className="w-full bg-teal-900 px-2 py-4 rounded-lg shadow-lg">
                            Upload
                        </button>
                    </>
                }
            </div>
        </div>
    )
}

export default Upload;