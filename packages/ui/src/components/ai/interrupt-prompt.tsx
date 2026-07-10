"use client"

import { X } from "lucide-react"

interface InterruptPromptProps {
  isOpen: boolean
  close: () => void
}

export function InterruptPrompt({ isOpen, close }: InterruptPromptProps) {
  if (!isOpen) return null

  return (
    <div className="absolute -top-10 left-1/2 flex -translate-x-1/2 animate-in overflow-hidden rounded-full border border-border bg-background py-1 text-center text-sm whitespace-nowrap text-muted-foreground duration-200 fade-in slide-in-from-bottom-2">
      <span className="ml-2.5">Press Enter again to interrupt</span>
      <button
        className="mr-2.5 ml-1 flex items-center"
        type="button"
        onClick={close}
        aria-label="Close"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}
