import type { ReactNode } from "react"
import {
  Alert,
  AlertAction,
  AlertDescription,
} from "@workspace/ui/components/alert"

export interface SunsetBannerProps {
  message?: string
  action?: ReactNode
}

export function SunsetBanner({
  message = "Theo is launching soon.",
  action,
}: SunsetBannerProps) {
  return (
    <Alert className="rounded-none border-x-0 border-t-0 bg-secondary py-2">
      <AlertDescription className="flex w-full items-center justify-center gap-2 text-center text-xs sm:text-sm">
        <span>{message}</span>
        {action ? <AlertAction>{action}</AlertAction> : null}
      </AlertDescription>
    </Alert>
  )
}
