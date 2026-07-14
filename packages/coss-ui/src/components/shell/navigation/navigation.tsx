"use client"

import type React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { CommandTrigger } from "../command-palette"
import { useSidebarState } from "../sidebar-state"
import {
  shellMobileBottomNavClassName,
  shellMobileBottomSpacerClassName,
} from "../shell-layout"
import type { NavItem } from "../types"
import { ShellMobileNavItem, ShellNavItem } from "./navigation-item"

export function ShellNav({ items }: { items: NavItem[] }): React.ReactElement {
  const { isIconSidebar } = useSidebarState()

  return (
    <nav
      className={cn(
        "flex w-full flex-col gap-1",
        isIconSidebar ? "items-center" : "items-stretch"
      )}
    >
      {items.map((item) => (
        <ShellNavItem item={item} key={item.name} />
      ))}
      {isIconSidebar ? <CommandTrigger /> : null}
    </nav>
  )
}

export function ShellMobileNav({
  items,
}: {
  items: NavItem[]
}): React.ReactElement {
  return (
    <>
      <div aria-hidden className={shellMobileBottomSpacerClassName} />
      <nav className={shellMobileBottomNavClassName}>
        {items.map((item) => (
          <ShellMobileNavItem item={item} key={item.name} />
        ))}
      </nav>
    </>
  )
}
