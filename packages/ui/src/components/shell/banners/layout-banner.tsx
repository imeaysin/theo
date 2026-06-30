import type React from "react"

export interface BannerContainerProps {
  children?: React.ReactNode
}

export function BannerContainer({
  children,
}: BannerContainerProps): React.ReactElement | null {
  if (!children) return null

  return (
    <div className="sticky top-0 z-10 w-full divide-y divide-border">
      {children}
    </div>
  )
}
