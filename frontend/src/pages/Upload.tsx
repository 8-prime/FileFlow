import { JSX } from "react"
import FileUpload from "../components/FileUpload";

const DownloadLimit = (): JSX.Element => {
    return (
        <div>
            <p>Download limit</p>
            <input className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg shadow-lg" type="number" />
        </div>
    )
}


const Upload = (): JSX.Element => {
    return (
        <div className="grow flex flex-col justify-center items-center">
            <FileUpload />
            <DownloadLimit />
        </div>
    )
}

export default Upload;