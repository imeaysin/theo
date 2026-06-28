import type { ReactNode } from "react"

export interface SunsetBannerProps {
  message?: string
  action?: ReactNode
}

export function SunsetBanner({
  message = "Theo is launching soon.",
  action,
}: SunsetBannerProps) {
  return (
    <div className="w-full border-b border-border bg-secondary text-foreground">
      <div className="flex h-9 items-center justify-center gap-2 px-4 text-center font-sans text-xs sm:text-sm">
        <span>{message}</span>
        {action}
      </div>
    </div>
  )
}
