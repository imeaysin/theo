"use client"

import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  RotateCwIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type React from "react"
import { Fragment, useState } from "react"
import {
  Drawer,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuLinkItem,
  MenuPopup,
  MenuTrigger,
} from "@workspace/ui/components/menu"
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"
import { useShell } from "../shell-context"
import { useSidebarState } from "../sidebar-state"
import type { NavItem } from "../types"
import {
  contentNavItemClassName,
  mobileBottomNavItemClassName,
  sidebarChevronClassName,
  sidebarMenuSubClassName,
  sidebarNavItemClassName,
  sidebarNavSubItemClassName,
} from "./navigation-styles"
import {
  isNavGroupOpen,
  isNavItemActive,
  isNavParentActive,
} from "./navigation-utils"

function NavItemIcon({
  icon: Icon,
  isLoading,
  className = "size-4 shrink-0",
}: {
  icon?: LucideIcon
  isLoading?: boolean
  className?: string
}): React.ReactElement | null {
  if (isLoading) {
    return <RotateCwIcon className={cn(className, "animate-spin")} />
  }

  if (!Icon) return null

  return <Icon aria-hidden="true" className={className} />
}

function NavGroupPanel({
  open,
  children,
}: {
  open: boolean
  children: React.ReactNode
}): React.ReactElement {
  return (
    <div
      aria-hidden={!open}
      className={cn(
        "grid transition-all duration-300 ease-in-out",
        open
          ? "visible grid-rows-[1fr] opacity-100"
          : "invisible grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="overflow-hidden">
        <ul className={sidebarMenuSubClassName}>{children}</ul>
      </div>
    </div>
  )
}

function IconSidebarParentItem({
  item,
  hasActiveChild,
}: {
  item: NavItem
  hasActiveChild: boolean
}): React.ReactElement {
  const { t, pathname, Link } = useShell()

  return (
    <Menu>
      <MenuTrigger
        render={
          <button
            aria-haspopup="menu"
            aria-label={t(item.name)}
            className={sidebarNavItemClassName}
            data-active={hasActiveChild ? true : undefined}
            type="button"
          />
        }
      >
        <NavItemIcon icon={item.icon} isLoading={item.isLoading} />
      </MenuTrigger>
      <MenuPopup align="start" className="min-w-44" side="right" sideOffset={8}>
        <MenuGroup>
          <MenuGroupLabel>{t(item.name)}</MenuGroupLabel>
          {item.child?.map((child) => {
            const ChildIcon = child.icon
            const childCurrent = isNavItemActive(child, pathname, true)

            return (
              <MenuLinkItem
                aria-current={childCurrent ? "page" : undefined}
                key={child.name}
                render={<Link href={child.href} target={child.target} />}
              >
                {ChildIcon ? (
                  <ChildIcon aria-hidden="true" className="size-4 shrink-0" />
                ) : null}
                {t(child.name)}
              </MenuLinkItem>
            )
          })}
        </MenuGroup>
      </MenuPopup>
    </Menu>
  )
}

export function ShellNavItem({
  item,
  isChild = false,
}: {
  item: NavItem
  isChild?: boolean
}): React.ReactElement {
  const { t, pathname, Link } = useShell()
  const current = isNavItemActive(item, pathname, isChild)
  const [expanded, setExpanded] = useState(false)
  const { isIconSidebar } = useSidebarState()

  const hasChildren = !!item.child?.length
  const hasActiveChild = isNavParentActive(item, pathname)
  const isOpen = isNavGroupOpen(item, pathname, expanded)
  const isParentItem = hasChildren && !isChild

  if (isParentItem) {
    if (isIconSidebar) {
      return (
        <IconSidebarParentItem hasActiveChild={hasActiveChild} item={item} />
      )
    }

    const ChevronIcon = expanded ? ChevronUpIcon : ChevronDownIcon

    return (
      <Fragment>
        <button
          aria-current={current ? "page" : undefined}
          aria-expanded={isOpen}
          aria-label={t(item.name)}
          className={sidebarNavItemClassName}
          data-active={hasActiveChild ? true : undefined}
          onClick={() => setExpanded((value) => !value)}
          type="button"
        >
          {item.icon || item.isLoading ? (
            <NavItemIcon icon={item.icon} isLoading={item.isLoading} />
          ) : null}
          <span className="flex w-full items-center justify-between truncate">
            {t(item.name)}
            {item.badge}
          </span>
          {hasChildren && !hasActiveChild ? (
            <ChevronIcon
              aria-hidden="true"
              className={sidebarChevronClassName}
            />
          ) : null}
        </button>
        <NavGroupPanel open={isOpen}>
          {item.child?.map((child) => (
            <li key={child.name}>
              <ShellNavItem isChild item={child} />
            </li>
          ))}
        </NavGroupPanel>
      </Fragment>
    )
  }

  if (isChild) {
    return (
      <Link
        aria-current={current ? "page" : undefined}
        aria-label={t(item.name)}
        className={sidebarNavSubItemClassName}
        data-testid={item.name}
        href={item.href}
        target={item.target}
      >
        <NavItemIcon icon={item.icon} isLoading={item.isLoading} />
        <span className="truncate">{t(item.name)}</span>
        {item.badge}
      </Link>
    )
  }

  if (isIconSidebar) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              aria-current={current ? "page" : undefined}
              aria-label={t(item.name)}
              className={sidebarNavItemClassName}
              data-testid={item.name}
              href={item.href}
              target={item.target}
            />
          }
        >
          <NavItemIcon icon={item.icon} isLoading={item.isLoading} />
        </TooltipTrigger>
        <TooltipPopup side="right">{t(item.name)}</TooltipPopup>
      </Tooltip>
    )
  }

  return (
    <Link
      aria-current={current ? "page" : undefined}
      aria-label={t(item.name)}
      className={sidebarNavItemClassName}
      data-testid={item.name}
      href={item.href}
      target={item.target}
    >
      <NavItemIcon icon={item.icon} isLoading={item.isLoading} />
      <span className="truncate">{t(item.name)}</span>
      {item.badge}
    </Link>
  )
}

export function ShellMobileNavItem({
  item,
  isChild = false,
  onClick,
  isActive,
}: {
  item: NavItem
  isChild?: boolean
  onClick?: () => void
  isActive?: boolean
}): React.ReactElement {
  const { t, pathname, Link } = useShell()
  const current = isActive ?? isNavItemActive(item, pathname, isChild)
  const Icon = item.icon

  const content = (
    <>
      {item.badge ? (
        <div className="absolute top-1 right-1">{item.badge}</div>
      ) : null}
      {Icon ? (
        <Icon
          aria-hidden="true"
          className="mx-auto mb-1 block size-5 shrink-0 text-center text-inherit"
        />
      ) : null}
      <span className="block truncate">{t(item.name)}</span>
    </>
  )

  if (onClick) {
    return (
      <button
        aria-current={current ? "page" : undefined}
        className={mobileBottomNavItemClassName}
        onClick={onClick}
        type="button"
      >
        {content}
      </button>
    )
  }

  return (
    <Link
      aria-current={current ? "page" : undefined}
      className={mobileBottomNavItemClassName}
      href={item.href}
      target={item.target}
    >
      {content}
    </Link>
  )
}

export function ShellMobileNavMoreItem({
  item,
  onNavigate,
}: {
  item: NavItem
  onNavigate?: () => void
}): React.ReactElement {
  const { t, pathname, Link } = useShell()

  const Icon = item.icon
  const hasChildren = !!item.child?.length
  const isActionItem = !item.href && item.onClick
  const current = isNavItemActive(item, pathname, false)

  const rowClassName = contentNavItemClassName

  const label = (
    <>
      {Icon ? <Icon aria-hidden="true" className="size-4 shrink-0" /> : null}
      <span className="truncate">{t(item.name)}</span>
    </>
  )

  if (hasChildren) {
    return (
      <Drawer>
        <DrawerTrigger
          render={<button className={rowClassName} type="button" />}
        >
          {label}
          <ChevronRightIcon className="ml-auto size-4 shrink-0 text-muted-foreground" />
        </DrawerTrigger>
        <DrawerPopup className="md:hidden" showBar>
          <div className="px-5 pt-4 pb-2">
            <DrawerTitle>{t(item.name)}</DrawerTitle>
          </div>
          <div className="max-h-[70vh] overflow-y-auto pb-[env(safe-area-inset-bottom)]">
            <nav className="flex flex-col gap-0.5 px-2 pb-4">
              {item.child?.map((childItem) => {
                const ChildIcon = childItem.icon
                const childCurrent = isNavItemActive(childItem, pathname, true)
                return (
                  <Link
                    aria-current={childCurrent ? "page" : undefined}
                    className={rowClassName}
                    href={childItem.href}
                    key={childItem.name}
                    onClick={onNavigate}
                    target={childItem.target}
                  >
                    {ChildIcon ? (
                      <ChildIcon
                        aria-hidden="true"
                        className="size-4 shrink-0"
                      />
                    ) : null}
                    <span className="truncate">{t(childItem.name)}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </DrawerPopup>
      </Drawer>
    )
  }

  if (isActionItem) {
    return (
      <button
        className={rowClassName}
        onClick={(event) => {
          item.onClick?.(event)
          onNavigate?.()
        }}
        type="button"
      >
        {label}
      </button>
    )
  }

  return (
    <Link
      aria-current={current ? "page" : undefined}
      className={rowClassName}
      href={item.href}
      onClick={onNavigate}
      target={item.target}
    >
      {label}
    </Link>
  )
}
