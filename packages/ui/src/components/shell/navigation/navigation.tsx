"use client"

import type React from "react"
import { useMemo } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { CommandTrigger } from "../command-palette"
import type { NavigationItemType } from "../types"
import {
  MobileNavigationItem,
  MobileNavigationMoreItem,
  NavigationItem,
} from "./navigation-item"

export const MORE_SEPARATOR_NAME = "more"

export function useNavigationItems(items: NavigationItemType[]) {
  return useMemo(() => {
    const desktopNavigationItems = items.filter(
      (item) => item.name !== MORE_SEPARATOR_NAME && !item.onlyMobile
    )
    const mobileNavigationBottomItems = items.filter(
      (item) =>
        (!item.moreOnMobile && !item.onlyDesktop) ||
        item.name === MORE_SEPARATOR_NAME
    )
    const mobileNavigationMoreItems = items.filter(
      (item) =>
        item.moreOnMobile &&
        !item.onlyDesktop &&
        item.name !== MORE_SEPARATOR_NAME
    )

    return {
      desktopNavigationItems,
      mobileNavigationBottomItems,
      mobileNavigationMoreItems,
    }
  }, [items])
}

export function Navigation({
  items,
}: {
  items: NavigationItemType[]
}): React.ReactElement {
  const { desktopNavigationItems } = useNavigationItems(items)

  return (
    <nav className="mt-2 flex-1 md:px-2 lg:mt-4 lg:px-0">
      {desktopNavigationItems.map((item) => (
        <NavigationItem item={item} key={item.name} />
      ))}
      <div className="mt-0.5 text-muted-foreground lg:hidden">
        <CommandTrigger />
      </div>
    </nav>
  )
}

export function MobileNavigation({
  items,
}: {
  items: NavigationItemType[]
}): React.ReactElement {
  const { mobileNavigationBottomItems } = useNavigationItems(items)

  return (
    <>
      <nav
        className={cn(
          "fixed bottom-0 left-0 z-30 flex w-full border-t border-border bg-sidebar/40 px-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] shadow backdrop-blur-md md:hidden"
        )}
      >
        {mobileNavigationBottomItems.map((item) => (
          <MobileNavigationItem item={item} key={item.name} />
        ))}
      </nav>
      <div className="block pt-12 md:hidden" />
    </>
  )
}

export function MobileNavigationMoreItems({
  items,
  bottomNavItems = [],
}: {
  items: NavigationItemType[]
  bottomNavItems?: NavigationItemType[]
}): React.ReactElement {
  const { mobileNavigationMoreItems } = useNavigationItems(items)

  const mobileMoreBottomItems = bottomNavItems.filter(
    (item) => item.name !== "Settings"
  )

  const allItems = [...mobileNavigationMoreItems, ...mobileMoreBottomItems]

  return (
    <ul className="mt-2 rounded-md border border-border">
      {allItems.map((item) => (
        <MobileNavigationMoreItem item={item} key={item.name} />
      ))}
    </ul>
  )
}
