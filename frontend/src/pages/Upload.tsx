import { JSX, useState } from "react";
import { FileUpload } from "@/components/FileUpload";

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
    return (
        <section className="grow w-full flex flex-col justify-center items-center pt-10">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">FileFlow</h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                            Upload your files quickly and share them with anyone. Set expiration dates and download limits.
                        </p>
                    </div>
                    <div className="w-full max-w-md">
                        <FileUpload />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Upload;