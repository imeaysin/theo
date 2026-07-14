"use client"

import type React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { ShellBackButton } from "./shell-back-button"
import {
  getShellCtaClassName,
  getShellMainSectionClassName,
  shellMainContentWithCtaClassName,
  shellMainHeaderClassName,
  shellMainHeadingClassName,
  shellMainSubtitleClassName,
} from "./shell-layout"

export type ShellMainHeaderProps = {
  heading: React.ReactNode
  subtitle?: React.ReactNode
  cta?: React.ReactNode
  actions?: React.ReactNode
  className?: string
  /** Smaller title scale for nested or settings views. */
  compact?: boolean
  /** Extra vertical padding for hero-style pages. */
  spacious?: boolean
}

export type ShellMainBackProps = {
  path: string | boolean
  onBack?: () => void
}

export type ShellMainProps = {
  header?: ShellMainHeaderProps
  back?: ShellMainBackProps
  contentClassName?: string
  children: React.ReactNode
}

function ShellMainHeader({
  heading,
  subtitle,
  cta,
  actions,
  className,
  compact,
  spacious,
  hasBackPath,
}: ShellMainHeaderProps & { hasBackPath: boolean }): React.ReactElement {
  return (
    <header
      className={cn(shellMainHeaderClassName, spacious && "py-2 md:py-8")}
    >
      <div className={cn("min-w-0 flex-1", className)}>
        <h3
          className={cn(
            shellMainHeadingClassName,
            compact && "text-base sm:text-lg"
          )}
        >
          {heading}
        </h3>
        {subtitle ? (
          <p className={shellMainSubtitleClassName} data-testid="subtitle">
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions}
      {cta ? (
        <div className={cn(getShellCtaClassName(hasBackPath), "md:shrink-0")}>
          {cta}
        </div>
      ) : null}
    </header>
  )
}

export function ShellMain({
  header,
  back,
  contentClassName,
  children,
}: ShellMainProps): React.ReactElement {
  const hasBackPath = back != null
  const showPageHeader = header != null || hasBackPath

  return (
    <>
      {showPageHeader ? (
        <div
          className={cn(
            getShellMainSectionClassName(Boolean(header?.compact)),
            hasBackPath && "flex items-start gap-2"
          )}
        >
          {hasBackPath ? (
            <ShellBackButton backPath={back.path} onBack={back.onBack} />
          ) : null}
          {header ? (
            <ShellMainHeader {...header} hasBackPath={hasBackPath} />
          ) : null}
        </div>
      ) : null}
      <div
        className={cn(
          header?.cta && shellMainContentWithCtaClassName,
          contentClassName
        )}
      >
        {children}
      </div>
    </>
  )
}
