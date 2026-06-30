import type { NavItem } from "../types"
import { defaultIsCurrent } from "./navigation-styles"

export function getIsCurrent(item: NavItem) {
  return item.isCurrent ?? defaultIsCurrent
}

export function isNavItemActive(
  item: NavItem,
  pathname: string | null,
  isChild = false
): boolean {
  return getIsCurrent(item)({ item, pathname, isChild })
}

export function isNavParentActive(
  item: NavItem,
  pathname: string | null
): boolean {
  if (!item.child?.length) return false
  return item.child.some((child) => isNavItemActive(child, pathname, true))
}

export function isNavGroupOpen(
  item: NavItem,
  pathname: string | null,
  expanded: boolean
): boolean {
  return (
    expanded ||
    isNavParentActive(item, pathname) ||
    isNavItemActive(item, pathname, false)
  )
}

export function flattenNavItems(items: NavItem[]): NavItem[] {
  return items.flatMap((item) => (item.child ? [item, ...item.child] : [item]))
}
