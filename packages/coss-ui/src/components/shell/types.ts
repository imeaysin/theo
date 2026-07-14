import type { LucideIcon } from "lucide-react"
import type React from "react"

export type ShellLinkProps = {
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

export type NavItem = {
  name: string
  href: string
  icon?: LucideIcon
  badge?: React.ReactNode
  child?: NavItem[]
  target?: string
  isLoading?: boolean
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
  isCurrent?: (args: {
    item: Pick<NavItem, "href">
    isChild?: boolean
    pathname: string | null
  }) => boolean
}

export type CommandAction = {
  id: string
  name: string
  section?: string
  keywords?: string
  shortcut?: string[]
  href?: string
  onSelect?: () => void
}
