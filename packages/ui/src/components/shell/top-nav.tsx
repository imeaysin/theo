"use client"

import type React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { CommandTrigger } from "./command-palette"
import { useShell } from "./shell-context"
import type { ShellUser, UserMenuItem } from "./types"
import { UserDropdown } from "./user-dropdown/user-dropdown"

export interface TopNavProps {
  user?: ShellUser | null
  userLoading?: boolean
  logo?: React.ReactNode
  brandLabel?: string
  homeHref?: string
  onSignOut?: () => void
  userMenuItems?: UserMenuItem[]
  signOutLabel?: string
}

export function TopNav({
  user,
  userLoading,
  logo,
  brandLabel,
  homeHref = "/",
  onSignOut,
  userMenuItems,
  signOutLabel,
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

      <div className="flex shrink-0 items-center gap-1">
        <CommandTrigger variant="topnav" />
        <UserDropdown
          loading={userLoading}
          menuItems={userMenuItems}
          onSignOut={onSignOut}
          placement="topnav"
          signOutLabel={signOutLabel}
          small
          user={user}
        />
      </div>
    </nav>
  )
}
