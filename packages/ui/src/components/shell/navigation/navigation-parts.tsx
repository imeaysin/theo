"use client"

import { ChevronDownIcon, ChevronUpIcon, RotateCwIcon } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type React from "react"
import { cn } from "@workspace/ui/lib/utils"

const navIconClassName = "h-4 w-4 shrink-0 lg:mr-2"

export function NavItemIcon({
  icon: Icon,
  isLoading,
  className = navIconClassName,
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

export function ExpansionChevron({
  expanded,
  className,
}: {
  expanded: boolean
  className?: string
}): React.ReactElement {
  const Icon = expanded ? ChevronUpIcon : ChevronDownIcon
  return <Icon className={className} />
}

export function NavigationChildPanel({
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
      <div className="overflow-hidden">{children}</div>
    </div>
  )
}

export function getSidebarChildClassName(index?: number): string {
  const base = "hidden h-8 pl-16 lg:flex lg:pl-11"

  if (index === 0) {
    return cn(base, "mt-0")
  }

  return cn(base, "mt-1 hover:mt-1 [&[aria-current='page']]:mt-1")
}
