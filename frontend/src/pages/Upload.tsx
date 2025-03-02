import { JSX } from "react";
import { FileUpload } from "@/components/FileUpload";

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