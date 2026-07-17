"use client"

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@workspace/ui-shadcn/components/dialog"
import type React from "react"

interface Props {
  setVideoToggled: React.Dispatch<React.SetStateAction<boolean>>
}

const VideoModal = ({ setVideoToggled }: Props) => {
  return (
    <Dialog
      defaultOpen
      onOpenChange={(open) => {
        if (!open) setVideoToggled(false)
      }}
    >
      <DialogContent
        className="max-w-5xl overflow-hidden p-0 sm:max-w-5xl"
        showCloseButton
      >
        <DialogTitle className="sr-only">Cap demo video</DialogTitle>
        <div className="relative aspect-video w-full">
          <iframe
            src="https://www.rend.so/embed/10512af0-b922-4efa-8974-f8f14fc1886a?autoplay=1&muted=0&accent=3e63dd"
            className="absolute inset-0 size-full border-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Cap demo video"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default VideoModal
