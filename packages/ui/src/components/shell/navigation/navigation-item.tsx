"use client"

import {
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  RotateCwIcon,
} from "lucide-react"
import type React from "react"
import { Fragment, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { useShell } from "../shell-context"
import type { NavigationItemType } from "../types"

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

const defaultIsCurrent: NonNullable<NavigationItemType["isCurrent"]> = ({
  isChild,
  item,
  pathname,
}) =>
  isChild
    ? item.href === pathname
    : item.href
      ? (pathname?.startsWith(item.href) ?? false)
      : false

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
  const Icon = item.icon

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
                  "group relative mt-0.5 flex w-full items-center rounded-md px-2 py-1.5 text-sm font-medium text-sidebar-foreground transition",
                  "md:justify-center lg:justify-start",
                  "[&[aria-current='page']]:bg-sidebar-accent [&[aria-current='page']]:text-sidebar-accent-foreground",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                onClick={() => setIsExpanded(!isExpanded)}
                type="button"
              />
            }
          >
            {Icon && (
              <div className="relative">
                {item.isLoading ? (
                  <RotateCwIcon className="h-4 w-4 shrink-0 animate-spin lg:mr-2" />
                ) : (
                  <Icon className="h-4 w-4 shrink-0 lg:mr-2" aria-hidden="true" />
                )}
                {shouldShowChevron && (
                  <span className="absolute -right-0.5 -bottom-0.5 rounded-full bg-sidebar-accent p-0.5 lg:hidden">
                    {isExpanded ? (
                      <ChevronUpIcon className="h-2.5 w-2.5" />
                    ) : (
                      <ChevronDownIcon className="h-2.5 w-2.5" />
                    )}
                  </span>
                )}
              </div>
            )}
            <span className="hidden w-full justify-between truncate lg:flex">
              {t(item.name)}
              {item.badge}
            </span>
            {shouldShowChevron &&
              (isExpanded ? (
                <ChevronUpIcon className="ml-auto hidden h-4 w-4 lg:block" />
              ) : (
                <ChevronDownIcon className="ml-auto hidden h-4 w-4 lg:block" />
              ))}
          </TooltipTrigger>
          <TooltipPopup className="lg:hidden" side="right">
            {t(item.name)}
          </TooltipPopup>
        </Tooltip>
        {hasChildren && (
          <div
            aria-hidden={!shouldShowChildren}
            className={cn(
              "grid transition-all duration-300 ease-in-out",
              shouldShowChildren
                ? "visible grid-rows-[1fr] opacity-100"
                : "invisible grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              {item.child?.map((child, index) => (
                <NavigationItem
                  index={index}
                  isChild
                  item={child}
                  key={child.name}
                />
              ))}
            </div>
          </div>
        )}
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
              "group flex items-center rounded-md px-2 py-1.5 text-sm font-medium text-sidebar-foreground transition",
              isChild
                ? cn(
                    "hidden h-8 pl-16 lg:flex lg:pl-11 [&[aria-current='page']]:bg-sidebar-accent [&[aria-current='page']]:text-sidebar-accent-foreground",
                    props.index === 0
                      ? "mt-0"
                      : "mt-1 hover:mt-1 [&[aria-current='page']]:mt-1"
                  )
                : "mt-0.5 md:justify-center lg:justify-start [&[aria-current='page']]:bg-sidebar-accent [&[aria-current='page']]:text-sidebar-accent-foreground",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
            data-test-id={item.name}
            href={item.href}
            target={item.target}
          />
        }
      >
        {Icon &&
          (item.isLoading ? (
            <RotateCwIcon className="h-4 w-4 shrink-0 animate-spin lg:mr-2" />
          ) : (
            <Icon
              aria-hidden="true"
              className="h-4 w-4 shrink-0 lg:mr-2"
            />
          ))}
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
}> = (props) => {
  const { item, isChild } = props
  const { t, pathname, Link } = useShell()
  const isCurrent = item.isCurrent ?? defaultIsCurrent
  const current = isCurrent({ isChild: !!isChild, item, pathname })
  const Icon = item.icon

  return (
    <Link
      aria-current={current ? "page" : undefined}
      className="relative my-2 min-w-0 flex-1 overflow-hidden rounded-md bg-transparent! p-1 text-center text-xs font-medium text-muted-foreground hover:text-foreground focus:z-10 sm:text-sm [&[aria-current='page']]:text-foreground"
      href={item.href}
      target={item.target}
    >
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
    </Link>
  )
}

export const MobileNavigationMoreItem: React.FC<{
  item: NavigationItemType
}> = (props) => {
  const { item } = props
  const { t, Link } = useShell()
  const [isExpanded, setIsExpanded] = usePersistedExpansionState(item.name)

  const Icon = item.icon
  const hasChildren = !!item.child && item.child.length > 0
  const isActionItem = !item.href && item.onClick

  const itemContent = (
    <>
      <span className="flex items-center font-semibold text-foreground">
        {Icon ? (
          <Icon aria-hidden="true" className="mr-3 size-5 shrink-0" />
        ) : null}
        {t(item.name)}
      </span>
      {!isActionItem ? (
        <ArrowRightIcon className="size-5 text-muted-foreground" />
      ) : null}
    </>
  )

  return (
    <li className="border-b border-border last:border-b-0">
      {hasChildren ? (
        <>
          <button
            className="flex w-full items-center justify-between p-5 text-left transition hover:bg-accent"
            onClick={() => setIsExpanded(!isExpanded)}
            type="button"
          >
            <span className="flex items-center font-semibold text-foreground">
              {Icon ? (
                <Icon aria-hidden="true" className="mr-3 size-5 shrink-0" />
              ) : null}
              {t(item.name)}
            </span>
            {isExpanded ? (
              <ChevronUpIcon className="size-5 text-muted-foreground" />
            ) : (
              <ChevronDownIcon className="size-5 text-muted-foreground" />
            )}
          </button>
          <div
            className={cn(
              "grid transition-all duration-300 ease-in-out",
              isExpanded
                ? "visible grid-rows-[1fr] opacity-100"
                : "invisible grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              {item.child ? (
                <ul className="bg-muted">
                  {item.child.map((childItem) => (
                    <li className="border-t border-border" key={childItem.name}>
                      <Link
                        className="flex items-center p-4 pl-12 transition hover:bg-sidebar-accent"
                        href={childItem.href}
                        target={childItem.target}
                      >
                        <span className="font-medium text-foreground">
                          {t(childItem.name)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </>
      ) : isActionItem ? (
        <button
          className="flex w-full items-center justify-between p-5 text-left transition hover:bg-accent"
          onClick={item.onClick}
          type="button"
        >
          {itemContent}
        </button>
      ) : (
        <Link
          className="flex items-center justify-between p-5 transition hover:bg-accent"
          href={item.href}
          target={item.target}
        >
          {itemContent}
        </Link>
      )}
    </li>
  )
}
