"use client"

import {
  useImpersonatedBy,
  useStopImpersonating,
  useUser,
} from "@workspace/auth/react"
import { Button } from "@workspace/ui/components/button"
import { toastManager } from "@workspace/ui/components/toast"
import { cn } from "@workspace/ui/lib/utils"

export type ImpersonationBannerProps = {
  className?: string
}

export function ImpersonationBanner({ className }: ImpersonationBannerProps) {
  const impersonatedBy = useImpersonatedBy()
  const { data: user } = useUser()
  const { mutate: stopImpersonating, isPending } = useStopImpersonating()

  if (!impersonatedBy) return null

  const userLabel = user?.name ?? user?.email ?? "this user"

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-amber-500/30 bg-amber-500/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <p className="text-sm">
        Impersonating <span className="font-medium">{userLabel}</span>
      </p>
      <Button
        disabled={isPending}
        onClick={() =>
          stopImpersonating(undefined, {
            onSuccess: () => {
              toastManager.add({
                title: "Impersonation ended",
                description: "Your admin session has been restored.",
                type: "success",
              })
            },
            onError: () => {
              toastManager.add({
                title: "Could not stop impersonating",
                description: "Please try again.",
                type: "error",
              })
            },
          })
        }
        size="sm"
        type="button"
        variant="outline"
      >
        Stop impersonating
      </Button>
    </div>
  )
}
