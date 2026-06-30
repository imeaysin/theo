import { cn } from "@workspace/ui/lib/utils"
import type { NavigationItemType } from "../types"

export const sidebarNavItemClassName = cn(
  "group mt-0.5 flex w-full items-center rounded-md px-2 py-1.5 text-sm font-medium text-sidebar-foreground transition",
  "md:justify-center lg:justify-start",
  "[&[aria-current='page']]:bg-sidebar-accent [&[aria-current='page']]:text-sidebar-accent-foreground",
  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
)

export const contentNavItemClassName = cn(
  "group flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium text-foreground transition",
  "hover:bg-accent hover:text-accent-foreground",
  "[&[aria-current='page']]:bg-accent [&[aria-current='page']]:text-accent-foreground"
)

export const mobileBottomNavItemClassName = cn(
  "relative my-2 min-w-0 flex-1 overflow-hidden rounded-md bg-transparent p-1 text-center text-xs font-medium",
  "text-muted-foreground hover:text-foreground focus:z-10 sm:text-sm",
  "[&[aria-current='page']]:text-foreground"
)

export function defaultIsCurrent({
  isChild,
  item,
  pathname,
}: {
  item: Pick<NavigationItemType, "href">
  isChild?: boolean
  pathname: string | null
}): boolean {
  if (!item.href) return false
  if (isChild) return item.href === pathname
  return pathname?.startsWith(item.href) ?? false
}
