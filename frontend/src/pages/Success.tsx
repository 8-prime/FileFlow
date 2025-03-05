
import { useState } from "react"
import { Check, Copy, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { NavLink, useParams } from "react-router"
import { Header } from "@/components/Header"

export default function Success() {
    const [copied, setCopied] = useState(false)
    const { uploadId } = useParams();
    const shareUrl = `${window.location.origin}/files/${uploadId}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="grow flex flex-col">
            <Header />
            <div className="grow flex flex-col justify-center items-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Files Uploaded Successfully!</CardTitle>
                        <CardDescription>Your files are ready to share. Use the link below.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-md bg-muted p-4">
                            <div className="flex items-center space-x-2">
                                <Download className="h-5 w-5 text-muted-foreground" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">Download Link</p>
                                    <p className="text-xs text-muted-foreground">This link will expire according to your settings</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Input readOnly value={shareUrl} className="font-mono text-sm" />
                            <Button size="icon" variant="outline" onClick={copyToClipboard} className="shrink-0">
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                <span className="sr-only">Copy link</span>
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="flex w-full justify-between">
                            <Button variant="outline" asChild>
                                <NavLink to="/">Upload More Files</NavLink>
                            </Button>
                            <Button asChild>
                                <NavLink to="/admin">Go to Admin</NavLink>
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
