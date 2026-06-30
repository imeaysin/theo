import { cn } from "@workspace/ui/lib/utils"
import type { NavItem } from "../types"

/** 32px icon control — shadcn SidebarMenuButton collapsible=icon. */
export const sidebarIconButtonClassName = cn(
  "flex size-8 shrink-0 items-center justify-center rounded-lg p-2 text-sidebar-foreground ring-sidebar-ring outline-none transition",
  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
  "focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground",
  "[&_svg]:size-4 [&_svg]:shrink-0"
)

/** Primary sidebar nav row — shadcn SidebarMenuButton default. */
export const sidebarNavItemClassName = cn(
  "flex h-8 w-full min-w-0 items-center gap-2 overflow-hidden rounded-lg px-2 text-sm font-medium text-sidebar-foreground ring-sidebar-ring outline-none transition",
  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
  "focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground",
  "[&_svg]:size-4 [&_svg]:shrink-0",
  "in-data-[collapsed]:size-8 in-data-[collapsed]:w-8 in-data-[collapsed]:shrink-0 in-data-[collapsed]:justify-center in-data-[collapsed]:gap-0 in-data-[collapsed]:p-2",
  "data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground",
  "[&[aria-current='page']]:bg-sidebar-accent [&[aria-current='page']]:font-medium [&[aria-current='page']]:text-sidebar-accent-foreground"
)

/** Nested nav row. */
export const sidebarNavSubItemClassName = cn(
  "flex h-8 w-full min-w-0 items-center gap-2 overflow-hidden rounded-lg pl-8 pr-2 text-sm font-medium text-sidebar-foreground ring-sidebar-ring outline-none transition",
  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
  "focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground",
  "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-sidebar-accent-foreground",
  "[&[aria-current='page']]:bg-sidebar-accent [&[aria-current='page']]:font-medium [&[aria-current='page']]:text-sidebar-accent-foreground"
)

/** Nested nav list — no rail, flush with parent menu. */
export const sidebarMenuSubClassName = "flex flex-col gap-1"

export const sidebarHeaderActionClassName = sidebarIconButtonClassName

export const sidebarBrandLinkClassName = cn(
  "flex h-8 min-w-0 items-center gap-2 overflow-hidden rounded-lg px-2 font-heading text-sm tracking-wide text-sidebar-foreground outline-none transition",
  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
  "focus-visible:ring-2 ring-sidebar-ring"
)

export const sidebarChevronClassName =
  "ml-auto size-4 shrink-0 text-sidebar-foreground/60"

export const contentNavItemClassName = cn(
  "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground transition",
  "hover:bg-accent hover:text-accent-foreground",
  "[&[aria-current='page']]:bg-accent [&[aria-current='page']]:text-accent-foreground"
)

export const mobileBottomNavItemClassName = cn(
  "relative my-2 min-w-0 flex-1 overflow-hidden rounded-lg bg-transparent p-1 text-center text-xs font-medium",
  "text-muted-foreground hover:text-foreground focus:z-10 sm:text-sm",
  "[&[aria-current='page']]:text-foreground"
)

export function defaultIsCurrent({
  isChild,
  item,
  pathname,
}: {
  item: Pick<NavItem, "href">
  isChild?: boolean
  pathname: string | null
}): boolean {
  if (!item.href) return false
  if (isChild) return item.href === pathname
  return pathname?.startsWith(item.href) ?? false
}
