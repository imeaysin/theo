import type { LucideIcon } from "lucide-react"
import type React from "react"

/**
 * Minimal, router-agnostic link contract. Apps adapt their router's link
 * component (e.g. react-router's `Link`) to this shape via `linkComponent`.
 */
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

export interface NavigationItemType {
  name: string
  href: string
  icon?: LucideIcon
  badge?: React.ReactNode
  child?: NavigationItemType[]
  target?: string
  isLoading?: boolean
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
  /** Hidden on mobile bottom bar, only shown on desktop sidebar. */
  onlyDesktop?: boolean
  /** Only shown on mobile. */
  onlyMobile?: boolean
  /** Pushed into the mobile "more" section instead of the bottom bar. */
  moreOnMobile?: boolean
  isCurrent?: (args: {
    item: Pick<NavigationItemType, "href">
    isChild?: boolean
    pathname: string | null
  }) => boolean
}

export interface UserMenuItem {
  label: string
  href?: string
  icon?: LucideIcon
  onClick?: () => void
  target?: string
  rel?: string
  variant?: "default" | "destructive"
  /** Render a separator above this item. */
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
