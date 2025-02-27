import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { JSX } from "react";

const FileView = (): JSX.Element => {

    const fileDetails = {
        name: "example-document.pdf",
        size: "2.4 MB",
        expiresAt: "Tomorrow at 2:30 PM",
        downloadsLeft: 2,
    }


    return (
        <div className="grow w-full flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Download File</CardTitle>
                    <CardDescription>
                        You can download this file {fileDetails.downloadsLeft} more time{fileDetails.downloadsLeft !== 1 && "s"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-md bg-muted p-4">
                        <div className="flex items-center space-x-4">
                            <div className="rounded-full bg-primary/10 p-2">
                                <Download className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">{fileDetails.name}</p>
                                <p className="text-sm text-muted-foreground">{fileDetails.size}</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        <p>This file will expire on {fileDetails.expiresAt}</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" size="lg">
                        <Download className="mr-2 h-4 w-4" />
                        Download File
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default FileView;