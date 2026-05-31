"use client"

import * as React from "react"
import { ArrowLeftIcon } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { Separator } from "@workspace/ui/components/separator"

export interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The sidebar component to render. */
  sidebar?: React.ReactNode
  /** Whether the sidebar should be open by default. */
  defaultSidebarOpen?: boolean
  /** The main heading of the page. */
  heading?: React.ReactNode
  /** The subtitle or description below the heading. */
  subtitle?: React.ReactNode
  /** Elements to render to the right of the heading. */
  actions?: React.ReactNode
  /** Primary call to action button. */
  cta?: React.ReactNode
  /** Path to navigate back to. If string or true, shows a back button. */
  backPath?: string | boolean
  /** Callback for when the back button is clicked. */
  onBack?: () => void
  /** Whether the header is in a loading state. */
  isLoading?: boolean
  /** Whether to omit the default <main> wrapper around children. */
  withoutMain?: boolean
  /** Optional class name for the header element. */
  headerClassName?: string
}

/**
 * Shell component provides the primary application layout structure,
 * including an optional sidebar, header with page-level controls, and main content area.
 *
 * Designed to be framework-agnostic for use in both Web and Desktop apps.
 */
export function Shell({
  children,
  sidebar,
  defaultSidebarOpen = true,
  heading,
  subtitle,
  actions,
  cta,
  backPath,
  onBack,
  isLoading,
  withoutMain,
  headerClassName,
  className,
  ...props
}: ShellProps) {
  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen}>
      {sidebar}
      <SidebarInset
        className={cn("flex flex-1 flex-col", className)}
        {...props}
      >
        <header
          className={cn(
            "sticky top-0 z-10 flex h-14 w-full shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60",
            headerClassName
          )}
        >
          <SidebarTrigger className="-ml-1" />
          {(heading || backPath || onBack) && (
            <>
              <Separator orientation="vertical" className="mr-2 h-4!" />
              <div className="flex flex-1 items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  {(backPath || onBack) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onBack}
                      className="size-8 shrink-0 sm:size-9"
                      aria-label="Go Back"
                    >
                      <ArrowLeftIcon className="size-4" />
                    </Button>
                  )}
                  <div className="flex flex-col gap-0.5">
                    {heading && (
                      <h1 className="text-sm font-semibold tracking-tight sm:text-base">
                        {isLoading ? (
                          <Skeleton className="h-5 w-32 sm:w-48" />
                        ) : (
                          heading
                        )}
                      </h1>
                    )}
                    {subtitle && (
                      <p className="hidden text-xs text-muted-foreground sm:block">
                        {isLoading ? (
                          <Skeleton className="mt-1 h-3 w-48 sm:w-64" />
                        ) : (
                          subtitle
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {(actions || cta) && (
                  <div className="flex shrink-0 items-center gap-2">
                    {actions}
                    {cta}
                  </div>
                )}
              </div>
            </>
          )}
        </header>

        {withoutMain ? (
          children
        ) : (
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}
