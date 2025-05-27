import { Check, Copy } from "lucide-react"
import { Button, buttonVariants } from "./ui/button"
import { forwardRef, useState } from "react"
import { safeCopyToClipboard } from "@/lib/utils"
import React from "react"
import { VariantProps } from "class-variance-authority"

export type CopyButtonProps = {
    text: string
    children?: React.ReactNode
} &
    React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean
    }


export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(({ text, children, ...props }, ref) => {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        safeCopyToClipboard(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Button
            ref={ref}
            onClick={copyToClipboard}
            {...props}
        >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {children}
        </Button>
    )
});