import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Slider } from "./ui/slider"

export type FileConfigurationStepProps = {
    setDownloadLimit: (value: number) => void,
    downloadLimit: number,
    expiration: string,
    setExpiration: (value: string) => void,
    files: File[]
}

const FileConfigurationStep = ({ setDownloadLimit, downloadLimit, expiration, setExpiration, files }: FileConfigurationStepProps) => {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="download-limit">Download Limit</Label>
                <div className="flex items-center space-x-4">
                    <Slider
                        id="download-limit"
                        min={1}
                        max={10}
                        step={1}
                        value={[downloadLimit]}
                        onValueChange={(value) => setDownloadLimit(value[0])}
                        className="flex-1"
                    />
                    <span className="w-12 text-center font-medium">{downloadLimit === 10 ? "∞" : downloadLimit}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                    {downloadLimit === 10
                        ? "Unlimited downloads"
                        : `File will be deleted after ${downloadLimit} download${downloadLimit !== 1 ? "s" : ""}`}
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="expiration">Expiration Time</Label>
                <Select value={expiration} onValueChange={setExpiration}>
                    <SelectTrigger id="expiration">
                        <SelectValue placeholder="Select expiration time" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1h">1 hour</SelectItem>
                        <SelectItem value="1d">1 day</SelectItem>
                        <SelectItem value="7d">7 days</SelectItem>
                        <SelectItem value="30d">30 days</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-medium">Files to upload ({files.length})</h3>
                <ul className="max-h-32 overflow-y-auto space-y-2">
                    {files.map((file, index) => (
                        <li key={index} className="text-sm truncate">
                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default FileConfigurationStep;