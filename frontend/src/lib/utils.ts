import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function isSecure(): boolean {
  return window.location.protocol === "https:"
}

export function safeCopyToClipboard(text: string) {
  if (isSecure()) {
    navigator.clipboard.writeText(text)
    return
  }
  const textArea = document.createElement("textarea")
  textArea.value = text
  // Avoid scrolling to bottom
  textArea.style.top = "0"
  textArea.style.left = "0"
  textArea.style.position = "fixed"
  textArea.style.visibility = ""

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand("copy")
    if (!successful) throw new Error("Failed to copy")
  }
  catch (err) {
    console.error("Failed to copy", err)
  }
  document.body.removeChild(textArea);
}