"use client"

import { useState } from "react"
import { toast } from "sonner"

interface ShareProps {
  post: {
    slug: string
    metadata: {
      title: string
    }
  }
  url: string
}

export function Share({ post, url }: ShareProps) {
  const [copied, setCopied] = useState(false)

  return (
    <div className="mt-12 border-t border-border pt-8">
      <p className="mb-4 text-sm font-medium text-foreground">Share</p>
      <div className="flex flex-wrap gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            post.metadata.title
          )}&url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center rounded-lg border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          X
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center rounded-lg border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          LinkedIn
        </a>
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard.writeText(url)
            toast.success("Link copied to clipboard")
            setCopied(true)
            window.setTimeout(() => setCopied(false), 2000)
          }}
          className="inline-flex h-9 items-center rounded-lg border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  )
}
