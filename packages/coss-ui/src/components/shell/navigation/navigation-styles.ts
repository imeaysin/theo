import { cn } from "@workspace/ui/lib/utils"
import type { NavItem } from "../types"

export const sidebarIconButtonClassName = cn(
  "flex size-8 shrink-0 items-center justify-center rounded-lg p-2 text-sidebar-foreground ring-sidebar-ring transition outline-none",
  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
  "focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground",
  "[&_svg]:size-4 [&_svg]:shrink-0"
)

export const sidebarNavItemClassName = cn(
  "flex h-8 w-full min-w-0 items-center gap-2 overflow-hidden rounded-lg px-2 text-sm font-medium text-sidebar-foreground ring-sidebar-ring transition-[width,height,padding] duration-200 ease-linear outline-none",
  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
  "focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground",
  "[&_svg]:size-4 [&_svg]:shrink-0",
  "in-data-[collapsed]:size-8 in-data-[collapsed]:w-8 in-data-[collapsed]:shrink-0 in-data-[collapsed]:justify-center in-data-[collapsed]:gap-0 in-data-[collapsed]:p-2",
  "data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground",
  "[&[aria-current='page']]:bg-sidebar-accent [&[aria-current='page']]:font-medium [&[aria-current='page']]:text-sidebar-accent-foreground"
)

export const sidebarNavSubItemClassName = cn(
  "flex h-8 w-full min-w-0 items-center gap-2 overflow-hidden rounded-lg pr-2 pl-8 text-sm font-medium text-sidebar-foreground ring-sidebar-ring transition outline-none",
  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
  "focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground",
  "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-sidebar-accent-foreground",
  "[&[aria-current='page']]:bg-sidebar-accent [&[aria-current='page']]:font-medium [&[aria-current='page']]:text-sidebar-accent-foreground"
)

export const sidebarMenuSubClassName = "flex flex-col gap-1"

export const sidebarHeaderActionClassName = sidebarIconButtonClassName

export const sidebarBrandLinkClassName = cn(
  "flex h-8 min-w-0 items-center gap-2 overflow-hidden rounded-lg px-2 font-heading text-sm tracking-wide text-sidebar-foreground transition outline-none",
  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
  "ring-sidebar-ring focus-visible:ring-2"
)

export const sidebarNavLabelClassName =
  "truncate transition-[margin,opacity] duration-200 ease-linear in-data-[collapsed]:w-0 in-data-[collapsed]:flex-0 in-data-[collapsed]:opacity-0"

export const sidebarChevronClassName = cn(
  "ml-auto size-4 shrink-0 text-sidebar-foreground/60 transition-[margin,opacity] duration-200 ease-linear",
  "in-data-[collapsed]:w-0 in-data-[collapsed]:flex-0 in-data-[collapsed]:opacity-0"
)

export const contentNavItemClassName = cn(
  "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground transition",
  "hover:bg-accent hover:text-accent-foreground",
  "[&[aria-current='page']]:bg-accent [&[aria-current='page']]:text-accent-foreground"
)

export const mobileBottomNavItemClassName = cn(
  "relative my-1 min-h-11 min-w-0 flex-1 overflow-hidden rounded-xl px-1 py-1.5 text-center text-[0.6875rem] leading-tight font-medium",
  "text-muted-foreground transition-colors hover:text-foreground focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
  "sm:min-h-12 sm:text-xs",
  "[&[aria-current='page']]:text-foreground"
)

export const shellMobileDrawerPortalProps = {
  className:
    "[&_[data-slot=drawer-backdrop]]:bg-transparent [&_[data-slot=drawer-backdrop]]:backdrop-blur-none",
}

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
