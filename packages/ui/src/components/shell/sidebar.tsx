"use client"

import type React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { CommandTrigger } from "./command-palette"
import { Navigation } from "./navigation/navigation"
import { NavigationItem } from "./navigation/navigation-item"
import { useShell } from "./shell-context"
import type { NavigationItemType, ShellUser, UserMenuItem } from "./types"
import { UserDropdown } from "./user-dropdown/user-dropdown"

export interface SideBarProps {
  user?: ShellUser | null
  userLoading?: boolean
  navigation: NavigationItemType[]
  bottomNavItems?: NavigationItemType[]
  logo?: React.ReactNode
  brandLabel?: string
  homeHref?: string
  onSignOut?: () => void
  userMenuItems?: UserMenuItem[]
  signOutLabel?: string
  bannersHeight?: number
}

export function SideBar({
  user,
  userLoading,
  navigation,
  bottomNavItems = [],
  logo,
  brandLabel,
  homeHref = "/",
  onSignOut,
  userMenuItems,
  signOutLabel,
  bannersHeight = 0,
}: SideBarProps): React.ReactElement {
  const { Link } = useShell()

  return (
    <div className="relative">
      <aside
        className={cn(
          "fixed left-0 hidden h-full max-h-screen w-(--sidebar-width-icon) min-w-(--sidebar-width-icon) flex-col overflow-x-hidden overflow-y-auto bg-sidebar font-sans text-sidebar-foreground md:sticky md:flex lg:w-(--sidebar-width) lg:min-w-(--sidebar-width) lg:px-3"
        )}
        style={
          {
            "--sidebar-width": "18rem",
            "--sidebar-width-icon": "3.5rem",
            maxHeight: `calc(100vh - ${bannersHeight}px)`,
            top: `${bannersHeight}px`,
          } as React.CSSProperties
        }
      >
        <div className="flex h-full flex-col justify-between py-3 lg:pt-4">
          <div>
            <header className="mb-3 hidden items-center justify-between lg:flex">
              <Link
                className="flex min-w-0 items-center gap-2 px-1.5 font-heading text-sm tracking-wide text-sidebar-foreground"
                href={homeHref}
              >
                {logo}
                {brandLabel ? (
                  <span className="truncate">{brandLabel}</span>
                ) : null}
              </Link>
              <div className="flex shrink-0 items-center gap-0.5">
                <CommandTrigger className="px-2 py-1.5" />
                <UserDropdown
                  loading={userLoading}
                  menuItems={userMenuItems}
                  onSignOut={onSignOut}
                  placement="sidebar"
                  signOutLabel={signOutLabel}
                  small
                  user={user}
                />
              </div>
            </header>

            {logo ? (
              <Link
                className="mb-2 text-center md:inline lg:hidden"
                href={homeHref}
              >
                {logo}
              </Link>
            ) : null}

            <Navigation items={navigation} />
          </div>

          {bottomNavItems.length > 0 && (
            <div className="md:px-2 md:pb-4 lg:p-0">
              {bottomNavItems.map((item, index) => (
                <div className={cn(index === 0 && "mt-3")} key={item.name}>
                  <NavigationItem item={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
