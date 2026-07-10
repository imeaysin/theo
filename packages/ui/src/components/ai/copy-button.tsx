"use client"

import { Check, Copy } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import { useCopyToClipboard } from "@workspace/ui/hooks/use-copy-to-clipboard"
import { Button } from "@workspace/ui/components/button"

type CopyButtonProps = {
  content: string
  copyMessage?: string
}

export function CopyButton({ content, copyMessage }: CopyButtonProps) {
  const { isCopied, handleCopy } = useCopyToClipboard({
    text: content,
    copyMessage,
  })

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-6 w-6"
      aria-label="Copy to clipboard"
      onClick={handleCopy}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Check
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isCopied ? "scale-100" : "scale-0"
          )}
        />
      </div>
      <Copy
        className={cn(
          "h-4 w-4 transition-transform duration-200",
          isCopied ? "scale-0" : "scale-100"
        )}
      />
    </Button>
  )
}
