"use client"

import { ChevronRightIcon } from "lucide-react"
import type React from "react"
import { Fragment, useState } from "react"
import {
  Drawer,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"
import { useShell } from "../shell-context"
import type { NavigationItemType } from "../types"
import {
  ExpansionChevron,
  getSidebarChildClassName,
  NavItemIcon,
  NavigationChildPanel,
} from "./navigation-parts"
import {
  contentNavItemClassName,
  defaultIsCurrent,
  mobileBottomNavItemClassName,
  sidebarNavItemClassName,
} from "./navigation-styles"

function readStoredExpansion(itemName: string): boolean | null {
  if (typeof window === "undefined") return null
  try {
    const stored = window.sessionStorage.getItem(`nav-expansion-${itemName}`)
    return stored === null ? null : (JSON.parse(stored) as boolean)
  } catch {
    return null
  }
}

const usePersistedExpansionState = (itemName: string) => {
  const [isExpanded, setIsExpanded] = useState(
    () => readStoredExpansion(itemName) ?? false
  )

  const setPersistedExpansion = (expanded: boolean) => {
    setIsExpanded(expanded)
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.setItem(
          `nav-expansion-${itemName}`,
          JSON.stringify(expanded)
        )
      } catch {
        // ignore storage failures
      }
    }
  }

  return [isExpanded, setPersistedExpansion] as const
}

export const NavigationItem: React.FC<{
  index?: number
  item: NavigationItemType
  isChild?: boolean
}> = (props) => {
  const { item, isChild } = props
  const { t, pathname, Link } = useShell()
  const isCurrent = item.isCurrent ?? defaultIsCurrent
  const current = isCurrent({ isChild: !!isChild, item, pathname })
  const [isExpanded, setIsExpanded] = usePersistedExpansionState(item.name)
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)

  const hasChildren = !!item.child && item.child.length > 0
  const hasActiveChild =
    hasChildren &&
    item.child?.some((child) =>
      isCurrent({ isChild: true, item: child, pathname })
    )
  const shouldShowChildren =
    isExpanded || hasActiveChild || isCurrent({ pathname, isChild, item })
  const shouldShowChevron = hasChildren && !hasActiveChild
  const isParentNavigationItem = hasChildren && !isChild

  if (isParentNavigationItem) {
    return (
      <Fragment>
        <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
          <TooltipTrigger
            render={
              <button
                aria-current={current ? "page" : undefined}
                aria-expanded={isExpanded}
                aria-label={t(item.name)}
                className={cn(
                  sidebarNavItemClassName,
                  "relative md:justify-center lg:justify-start"
                )}
                onClick={() => setIsExpanded(!isExpanded)}
                type="button"
              />
            }
          >
            {item.icon || item.isLoading ? (
              <div className="relative">
                <NavItemIcon icon={item.icon} isLoading={item.isLoading} />
                {shouldShowChevron ? (
                  <span className="absolute -right-0.5 -bottom-0.5 rounded-full bg-sidebar-accent p-0.5 lg:hidden">
                    <ExpansionChevron
                      className="h-2.5 w-2.5"
                      expanded={isExpanded}
                    />
                  </span>
                ) : null}
              </div>
            ) : null}
            <span className="hidden w-full justify-between truncate lg:flex">
              {t(item.name)}
              {item.badge}
            </span>
            {shouldShowChevron ? (
              <ExpansionChevron
                className="ml-auto hidden h-4 w-4 lg:block"
                expanded={isExpanded}
              />
            ) : null}
          </TooltipTrigger>
          <TooltipPopup className="lg:hidden" side="right">
            {t(item.name)}
          </TooltipPopup>
        </Tooltip>
        {hasChildren ? (
          <NavigationChildPanel open={shouldShowChildren}>
            {item.child?.map((child, index) => (
              <NavigationItem
                index={index}
                isChild
                item={child}
                key={child.name}
              />
            ))}
          </NavigationChildPanel>
        ) : null}
      </Fragment>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            aria-current={current ? "page" : undefined}
            aria-label={t(item.name)}
            className={cn(
              sidebarNavItemClassName,
              isChild
                ? getSidebarChildClassName(props.index)
                : "md:justify-center lg:justify-start"
            )}
            data-testid={item.name}
            href={item.href}
            target={item.target}
          />
        }
      >
        <NavItemIcon icon={item.icon} isLoading={item.isLoading} />
        <span className="hidden w-full justify-between truncate lg:flex">
          {t(item.name)}
          {item.badge}
        </span>
      </TooltipTrigger>
      <TooltipPopup className="lg:hidden" side="right">
        {t(item.name)}
      </TooltipPopup>
    </Tooltip>
  )
}

export const MobileNavigationItem: React.FC<{
  item: NavigationItemType
  isChild?: boolean
  onClick?: () => void
  isActive?: boolean
}> = (props) => {
  const { item, isChild, onClick, isActive } = props
  const { t, pathname, Link } = useShell()
  const isCurrent = item.isCurrent ?? defaultIsCurrent
  const current = isActive ?? isCurrent({ isChild: !!isChild, item, pathname })
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

export const MobileNavigationMoreItem: React.FC<{
  item: NavigationItemType
  onNavigate?: () => void
}> = (props) => {
  const { item, onNavigate } = props
  const { t, pathname, Link } = useShell()
  const isCurrent = item.isCurrent ?? defaultIsCurrent

  const Icon = item.icon
  const hasChildren = !!item.child && item.child.length > 0
  const isActionItem = !item.href && item.onClick
  const current = isCurrent({ isChild: false, item, pathname })

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
                const childCurrent = isCurrent({
                  isChild: true,
                  item: childItem,
                  pathname,
                })
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
