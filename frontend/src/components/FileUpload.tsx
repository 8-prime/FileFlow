import { JSX, useRef, useState } from "react";

const FileUpload = (): JSX.Element => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInput = useRef<HTMLInputElement>(null);

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(Array.from(event.target.files ?? []))
    };

    return (
        <div>
            {selectedFiles.map(f => {
                return <div key={f.name}>{f.name}</div>
            })}
            <input
                ref={fileInput}
                type="file"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="image-upload"
                multiple
            />
            <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                <button className="p-4 rounded-lg shadow-lg dark:bg-neutral-800" onClick={() => fileInput.current!.click()} >Select Image</button>
            </label>
        </div>
    )
}

export default FileUpload;