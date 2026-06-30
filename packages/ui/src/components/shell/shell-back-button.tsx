"use client"

import { ArrowLeftIcon } from "lucide-react"
import type React from "react"
import { Button } from "@workspace/ui/components/button"
import { useShell } from "./shell-context"

export function ShellBackButton({
  backPath,
  onBack,
}: {
  backPath: string | boolean
  onBack?: () => void
}): React.ReactElement {
  const { Link } = useShell()

  if (typeof backPath === "string") {
    return (
      <Button
        aria-label="Go back"
        className="mr-2 rounded-md"
        render={<Link href={backPath} />}
        size="icon-sm"
        variant="ghost"
      >
        <ArrowLeftIcon />
      </Button>
    )
  }

  return (
    <Button
      aria-label="Go back"
      className="mr-2 rounded-md"
      onClick={() => {
        if (onBack) {
          onBack()
          return
        }
        if (typeof window !== "undefined") {
          window.history.back()
        }
      }}
      size="icon-sm"
      variant="ghost"
    >
      <ArrowLeftIcon />
    </Button>
  )
}
