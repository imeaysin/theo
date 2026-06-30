import type { LucideIcon } from "lucide-react"
import type React from "react"

export interface ShellLinkProps {
  href: string
  children?: React.ReactNode
  className?: string
  target?: string
  rel?: string
  title?: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  "aria-label"?: string
  "aria-current"?: React.AriaAttributes["aria-current"]
  "data-testid"?: string
  "data-test-id"?: string
}

export type ShellLinkComponent = React.ComponentType<ShellLinkProps>

export interface ShellUser {
  name?: string | null
  email?: string | null
  avatarUrl?: string | null
}

export interface NavItem {
  name: string
  href: string
  icon?: LucideIcon
  badge?: React.ReactNode
  child?: NavItem[]
  target?: string
  isLoading?: boolean
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
  onlyDesktop?: boolean
  onlyMobile?: boolean
  moreOnMobile?: boolean
  excludeFromMobileMore?: boolean
  isCurrent?: (args: {
    item: Pick<NavItem, "href">
    isChild?: boolean
    pathname: string | null
  }) => boolean
}

/** @deprecated Use `NavItem` */
export type NavigationItemType = NavItem

export interface UserMenuItem {
  label: string
  href?: string
  icon?: LucideIcon
  onClick?: () => void
  target?: string
  rel?: string
  variant?: "default" | "destructive"
  separatorBefore?: boolean
}

export interface CommandAction {
  id: string
  name: string
  section?: string
  keywords?: string
  shortcut?: string[]
  href?: string
  onSelect?: () => void
}
