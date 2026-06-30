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
import { useSidebarState } from "../sidebar-state"
import type { NavItem } from "../types"
import {
  ShellMobileNavItem,
  ShellMobileNavMoreItem,
  ShellNavItem,
} from "./navigation-item"
import { shellMobileDrawerPortalProps } from "./navigation-styles"

export const MORE_SEPARATOR_NAME = "more"

function useShellNavItems(items: NavItem[]) {
  return useMemo(() => {
    const desktopItems = items.filter(
      (item) => item.name !== MORE_SEPARATOR_NAME && !item.onlyMobile
    )
    const mobileBottomItems = items.filter(
      (item) =>
        (!item.moreOnMobile && !item.onlyDesktop) ||
        item.name === MORE_SEPARATOR_NAME
    )
    const mobileMoreItems = items.filter(
      (item) =>
        item.moreOnMobile &&
        !item.onlyDesktop &&
        item.name !== MORE_SEPARATOR_NAME
    )

    return { desktopItems, mobileBottomItems, mobileMoreItems }
  }, [items])
}

export function ShellNav({ items }: { items: NavItem[] }): React.ReactElement {
  const { desktopItems } = useShellNavItems(items)
  const { isIconSidebar } = useSidebarState()

  return (
    <nav
      className={cn(
        "flex w-full flex-col gap-1",
        isIconSidebar ? "items-center" : "items-stretch"
      )}
    >
      {desktopItems.map((item) => (
        <ShellNavItem item={item} key={item.name} />
      ))}
      {isIconSidebar ? <CommandTrigger /> : null}
    </nav>
  )
}

export function ShellMobileNav({
  items,
  bottomNavItems = [],
}: {
  items: NavItem[]
  bottomNavItems?: NavItem[]
}): React.ReactElement {
  const { t } = useShell()
  const { mobileBottomItems } = useShellNavItems(items)
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <>
      <nav
        className={cn(
          "fixed bottom-0 left-0 z-30 flex w-full border-t border-border bg-background/80 px-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] shadow backdrop-blur-md md:hidden"
        )}
      >
        {mobileBottomItems.map((item) =>
          item.name === MORE_SEPARATOR_NAME ? (
            <ShellMobileNavItem
              isActive={moreOpen}
              item={item}
              key={item.name}
              onClick={() => setMoreOpen(true)}
            />
          ) : (
            <ShellMobileNavItem item={item} key={item.name} />
          )
        )}
      </nav>
      <div className="block pt-12 md:hidden" />

      <Drawer onOpenChange={setMoreOpen} open={moreOpen}>
        <DrawerPopup
          className="md:hidden"
          portalProps={shellMobileDrawerPortalProps}
          showBar
        >
          <div className="px-5 pt-4 pb-2">
            <DrawerTitle className="capitalize">
              {t(MORE_SEPARATOR_NAME)}
            </DrawerTitle>
          </div>
          <div className="max-h-[70vh] overflow-y-auto pb-[env(safe-area-inset-bottom)]">
            <ShellMobileNavMoreItems
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

export function ShellMobileNavMoreItems({
  items,
  bottomNavItems = [],
  onNavigate,
}: {
  items: NavItem[]
  bottomNavItems?: NavItem[]
  onNavigate?: () => void
}): React.ReactElement {
  const { mobileMoreItems } = useShellNavItems(items)

  const mobileMoreBottomItems = bottomNavItems.filter(
    (item) => !item.excludeFromMobileMore
  )

  const allItems = [...mobileMoreItems, ...mobileMoreBottomItems]

  return (
    <nav className="flex flex-col gap-0.5 px-2 pb-4">
      {allItems.map((item) => (
        <ShellMobileNavMoreItem
          item={item}
          key={item.name}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  )
}
