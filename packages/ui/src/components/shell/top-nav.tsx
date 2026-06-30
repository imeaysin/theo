"use client"

import type React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { CommandTrigger } from "./command-palette"
import { useShell } from "./shell-context"

export interface TopNavProps {
  logo?: React.ReactNode
  brandLabel?: string
  homeHref?: string
}

export function TopNav({
  logo,
  brandLabel,
  homeHref = "/",
}: TopNavProps): React.ReactElement {
  const { Link } = useShell()

  return (
    <nav
      className={cn(
        "sticky top-0 z-40 flex h-14 w-full items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-lg md:hidden"
      )}
    >
      <Link
        className="flex min-w-0 items-center gap-2 font-heading text-base tracking-wide text-foreground"
        href={homeHref}
      >
        {logo ? (
          <span className="flex size-7 shrink-0 items-center justify-center [&>svg]:size-6">
            {logo}
          </span>
        ) : null}
        {brandLabel ? <span className="truncate">{brandLabel}</span> : null}
      </Link>

      <CommandTrigger variant="topnav" />
    </nav>
  )
}
