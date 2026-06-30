import type { NavItem } from "../types"
import { defaultIsCurrent } from "./navigation-styles"

export function getIsCurrent(item: NavItem) {
  return item.isCurrent ?? defaultIsCurrent
}

interface NavItemActiveInput {
  item: NavItem
  pathname: string | null
  isChild?: boolean
}

export function isNavItemActive({
  item,
  pathname,
  isChild = false,
}: NavItemActiveInput): boolean {
  return getIsCurrent(item)({ item, pathname, isChild })
}

export function isNavParentActive(
  item: NavItem,
  pathname: string | null
): boolean {
  if (!item.child?.length) return false
  return item.child.some((child) =>
    isNavItemActive({ item: child, pathname, isChild: true })
  )
}

interface NavGroupOpenInput {
  item: NavItem
  pathname: string | null
  expanded: boolean
}

export function isNavGroupOpen({
  item,
  pathname,
  expanded,
}: NavGroupOpenInput): boolean {
  return (
    expanded ||
    isNavParentActive(item, pathname) ||
    isNavItemActive({ item, pathname, isChild: false })
  )
}

export function flattenNavItems(items: NavItem[]): NavItem[] {
  return items.flatMap((item) => (item.child ? [item, ...item.child] : [item]))
}
