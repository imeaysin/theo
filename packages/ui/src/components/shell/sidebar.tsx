"use client"

import { PanelLeftIcon } from "lucide-react"
import type React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { CommandTrigger } from "./command-palette"
import { ShellNav } from "./navigation/navigation"
import {
  sidebarBrandLinkClassName,
  sidebarIconButtonClassName,
} from "./navigation/navigation-styles"
import { useShell } from "./shell-context"
import { useSidebarState } from "./sidebar-state"
import type { NavItem } from "./types"

const SIDEBAR_WIDTH = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"

function SidebarLogoMark({
  logo,
}: {
  logo: React.ReactNode
}): React.ReactElement {
  return (
    <span className="flex size-4 shrink-0 items-center justify-center [&>svg]:size-full">
      {logo}
    </span>
  )
}

function SidebarBrand({
  logo,
  homeHref,
}: {
  logo?: React.ReactNode
  homeHref: string
}): React.ReactElement | null {
  const { Link } = useShell()
  const { toggleSidebar, isTabletIconOnly } = useSidebarState()

  if (!logo) return null

  const slotClassName = cn(sidebarIconButtonClassName, "absolute inset-0")

  return (
    <div className="group/brand relative size-8 shrink-0">
      <Link
        className={cn(
          slotClassName,
          "transition-opacity",
          !isTabletIconOnly &&
            "group-hover/brand:pointer-events-none group-hover/brand:opacity-0"
        )}
        href={homeHref}
      >
        <SidebarLogoMark logo={logo} />
      </Link>
      {!isTabletIconOnly ? (
        <button
          aria-label="Expand sidebar"
          className={cn(
            slotClassName,
            "opacity-0 transition-opacity group-hover/brand:opacity-100"
          )}
          onClick={toggleSidebar}
          type="button"
        >
          <PanelLeftIcon aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}

function SidebarTrigger({
  className,
  ...props
}: React.ComponentProps<"button">): React.ReactElement | null {
  const { toggleSidebar, isTabletIconOnly } = useSidebarState()

  if (isTabletIconOnly) return null

  return (
    <button
      aria-label="Toggle sidebar"
      className={cn(sidebarIconButtonClassName, className)}
      onClick={toggleSidebar}
      type="button"
      {...props}
    >
      <PanelLeftIcon aria-hidden="true" />
    </button>
  )
}

export type ShellSidebarProps = {
  navigation: NavItem[]
  logo?: React.ReactNode
  brandLabel?: string
  homeHref?: string
  sidebarUserControl?: React.ReactNode
}

export function ShellSidebar({
  navigation,
  logo,
  brandLabel,
  homeHref = "/",
  sidebarUserControl,
}: ShellSidebarProps): React.ReactElement {
  const { Link } = useShell()
  const { isIconSidebar } = useSidebarState()

  return (
    <div className="relative my-2.5 flex shrink-0">
      <aside
        className={cn(
          "hidden h-full flex-col overflow-x-hidden overflow-y-auto bg-sidebar p-2 font-sans text-sidebar-foreground transition-[width,min-width] duration-200 ease-linear md:sticky md:top-0 md:flex md:self-stretch",
          isIconSidebar
            ? "w-(--sidebar-width-icon) min-w-(--sidebar-width-icon)"
            : "w-(--sidebar-width) min-w-(--sidebar-width)"
        )}
        data-collapsed={isIconSidebar ? "" : undefined}
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          } as React.CSSProperties
        }
      >
        <div className="flex h-full flex-col gap-1">
          <div
            className={cn(
              "flex min-h-0 flex-1 flex-col gap-1",
              isIconSidebar ? "items-center" : "items-stretch"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-full shrink-0 items-center",
                isIconSidebar ? "justify-center" : "justify-between gap-1"
              )}
            >
              {isIconSidebar ? (
                <SidebarBrand homeHref={homeHref} logo={logo} />
              ) : (
                <>
                  <Link className={sidebarBrandLinkClassName} href={homeHref}>
                    {logo ? <SidebarLogoMark logo={logo} /> : null}
                    {brandLabel ? (
                      <span className="truncate">{brandLabel}</span>
                    ) : null}
                  </Link>
                  <div className="flex shrink-0 items-center gap-1">
                    <CommandTrigger compact />
                    <SidebarTrigger />
                  </div>
                </>
              )}
            </div>

            <ShellNav items={navigation} />
          </div>

          {sidebarUserControl ? (
            <div className="w-full shrink-0">{sidebarUserControl}</div>
          ) : null}
        </div>
      </aside>
    </div>
  )
}
