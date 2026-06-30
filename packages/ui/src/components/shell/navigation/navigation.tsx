"use client"

import type React from "react"
import { useMemo, useState } from "react"
import {
  Drawer,
  DrawerPopup,
  DrawerTitle,
} from "@workspace/ui/components/drawer"
import { cn } from "@workspace/ui/lib/utils"
import { CommandTrigger } from "../command-palette"
import { useShell } from "../shell-context"
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
    <nav className="mt-2 flex w-full flex-col gap-0.5 md:items-center lg:mt-4 lg:items-stretch">
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
  bottomNavItems = [],
}: {
  items: NavigationItemType[]
  bottomNavItems?: NavigationItemType[]
}): React.ReactElement {
  const { t } = useShell()
  const { mobileNavigationBottomItems } = useNavigationItems(items)
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <>
      <nav
        className={cn(
          "fixed bottom-0 left-0 z-30 flex w-full border-t border-border bg-background/80 px-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] shadow backdrop-blur-md md:hidden"
        )}
      >
        {mobileNavigationBottomItems.map((item) =>
          item.name === MORE_SEPARATOR_NAME ? (
            <MobileNavigationItem
              isActive={moreOpen}
              item={item}
              key={item.name}
              onClick={() => setMoreOpen(true)}
            />
          ) : (
            <MobileNavigationItem item={item} key={item.name} />
          )
        )}
      </nav>
      <div className="block pt-12 md:hidden" />

      <Drawer onOpenChange={setMoreOpen} open={moreOpen}>
        <DrawerPopup className="md:hidden" showBar>
          <div className="px-5 pt-4 pb-2">
            <DrawerTitle className="capitalize">
              {t(MORE_SEPARATOR_NAME)}
            </DrawerTitle>
          </div>
          <div className="max-h-[70vh] overflow-y-auto pb-[env(safe-area-inset-bottom)]">
            <MobileNavigationMoreItems
              bottomNavItems={bottomNavItems}
              items={items}
              onNavigate={() => setMoreOpen(false)}
            />
          </div>
        </DrawerPopup>
      </Drawer>
    </>
  )
}

export function MobileNavigationMoreItems({
  items,
  bottomNavItems = [],
  onNavigate,
}: {
  items: NavigationItemType[]
  bottomNavItems?: NavigationItemType[]
  onNavigate?: () => void
}): React.ReactElement {
  const { mobileNavigationMoreItems } = useNavigationItems(items)

  const mobileMoreBottomItems = bottomNavItems.filter(
    (item) => !item.excludeFromMobileMore
  )

  const allItems = [...mobileNavigationMoreItems, ...mobileMoreBottomItems]

  return (
    <nav className="flex flex-col gap-0.5 px-2 pb-4">
      {allItems.map((item) => (
        <MobileNavigationMoreItem
          item={item}
          key={item.name}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  )
}
