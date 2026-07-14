"use client"

import type React from "react"
import { useCallback, useRef, useState } from "react"
import {
  ConfirmDialog,
  type ConfirmDialogProps,
} from "@workspace/ui/components/confirm-dialog"

export type ConfirmDialogOptions = {
  title: string
  description?: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  variant?: ConfirmDialogProps["variant"]
}

export function useConfirmDialog() {
  const resolveRef = useRef<((confirmed: boolean) => void) | null>(null)
  const [request, setRequest] = useState<ConfirmDialogOptions | null>(null)

  const confirm = useCallback((options: ConfirmDialogOptions) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve
      setRequest(options)
    })
  }, [])

  const dismiss = useCallback((confirmed: boolean) => {
    resolveRef.current?.(confirmed)
    resolveRef.current = null
    setRequest(null)
  }, [])

  const dialog = (
    <ConfirmDialog
      cancelLabel={request?.cancelLabel}
      confirmLabel={request?.confirmLabel}
      description={request?.description}
      onConfirm={() => dismiss(true)}
      onOpenChange={(open) => {
        if (!open) dismiss(false)
      }}
      open={request !== null}
      title={request?.title ?? ""}
      variant={request?.variant}
    />
  )

  return { confirm, dialog }
}
