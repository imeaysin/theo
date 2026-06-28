"use client"

import { RotateCwIcon } from "lucide-react"
import type React from "react"
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"
import { CommandTrigger } from "./command-palette"
import { Navigation } from "./navigation/navigation"
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
  const { t, Link } = useShell()

  return (
    <div className="relative">
      <aside
        className={cn(
          "fixed left-0 hidden h-full max-h-screen w-(--sidebar-width-icon) min-w-(--sidebar-width-icon) flex-col overflow-x-hidden overflow-y-auto bg-sidebar font-sans text-sidebar-foreground md:sticky md:flex lg:w-(--sidebar-width) lg:min-w-(--sidebar-width) lg:px-3"
        )}
        style={{
          maxHeight: `calc(100vh - ${bannersHeight}px)`,
          top: `${bannersHeight}px`,
        }}
      >
        <div className="flex h-full flex-col justify-between py-3 lg:pt-4">
          <div>
            <header className="mb-3 hidden items-center justify-between lg:flex">
              <Link
                className="flex min-w-0 items-center gap-2 px-1.5 font-cal text-sm font-semibold tracking-wide text-sidebar-accent-foreground"
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
              {bottomNavItems.map((item, index) => {
                const Icon = item.icon
                const itemClassName = cn(
                  "group mt-0.5 flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm font-medium text-sidebar-foreground transition [&[aria-current='page']]:bg-sidebar-accent [&[aria-current='page']]:text-sidebar-accent-foreground",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  index === 0 && "mt-3"
                )
                const iconNode = Icon ? (
                  item.isLoading ? (
                    <RotateCwIcon className="ml-3 h-4 w-4 shrink-0 animate-spin md:mx-auto lg:mr-2 lg:ml-0" />
                  ) : (
                    <Icon
                      aria-hidden="true"
                      className="ml-3 h-4 w-4 shrink-0 md:mx-auto lg:mr-2 lg:ml-0"
                    />
                  )
                ) : null
                const labelNode = (
                  <span className="hidden w-full justify-between lg:flex">
                    <div className="flex">{t(item.name)}</div>
                  </span>
                )
                const trigger = item.href ? (
                  <Link
                    aria-label={t(item.name)}
                    className={itemClassName}
                    href={item.href}
                    onClick={
                      item.onClick as React.MouseEventHandler<HTMLAnchorElement>
                    }
                    target={item.target}
                  >
                    {iconNode}
                    {labelNode}
                  </Link>
                ) : (
                  <button
                    aria-label={t(item.name)}
                    className={itemClassName}
                    onClick={
                      item.onClick as React.MouseEventHandler<HTMLButtonElement>
                    }
                    type="button"
                  >
                    {iconNode}
                    {labelNode}
                  </button>
                )

                return (
                  <Tooltip key={item.name}>
                    <TooltipTrigger render={trigger} />
                    <TooltipPopup className="lg:hidden" side="right">
                      {t(item.name)}
                    </TooltipPopup>
                  </Tooltip>
                )
              })}
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
