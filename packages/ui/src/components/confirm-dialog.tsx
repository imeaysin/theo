"use client"

import type React from "react"
import { Button } from "@workspace/ui/components/button"
import { Pane } from "@workspace/ui/components/pane"

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
  pending?: boolean
  variant?: "default" | "destructive"
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  pending = false,
  variant = "default",
}: ConfirmDialogProps): React.ReactElement {
  return (
    <Pane.Alert onOpenChange={onOpenChange} open={open}>
      <Pane.Alert.Content>
        <Pane.Alert.Header>
          <Pane.Alert.Title>{title}</Pane.Alert.Title>
          {description ? (
            <Pane.Alert.Description>{description}</Pane.Alert.Description>
          ) : null}
        </Pane.Alert.Header>
        <Pane.Alert.Footer variant="bare">
          <Pane.Alert.Close
            render={<Button disabled={pending} variant="outline" />}
          >
            {cancelLabel}
          </Pane.Alert.Close>
          <Button
            disabled={pending}
            onClick={() => void onConfirm()}
            variant={variant === "destructive" ? "destructive" : "default"}
          >
            {confirmLabel}
          </Button>
        </Pane.Alert.Footer>
      </Pane.Alert.Content>
    </Pane.Alert>
  )
}
