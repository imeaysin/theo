"use client"

import { CircleAlertIcon } from "lucide-react"
import type * as React from "react"
import { Button } from "@workspace/ui-shadcn/components/button"
import {
  PageState,
  PageStateActions,
  PageStateDescription,
  PageStateHeader,
  PageStateIcon,
  PageStateTitle,
} from "@workspace/ui-shadcn/components/page-state"
import { cn } from "@workspace/ui-shadcn/lib/utils"

export type PageErrorProps = {
  title?: string
  description?: string
  homeHref?: string
  homeLabel?: string
  retryLabel?: string
  onRetry?: () => void
} & React.ComponentProps<typeof PageState>

export function PageError({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  homeHref = "/",
  homeLabel = "Go home",
  retryLabel = "Try again",
  onRetry,
  className,
  ...props
}: PageErrorProps) {
  return (
    <PageState className={cn(className)} {...props}>
      <PageStateHeader>
        <PageStateIcon>
          <CircleAlertIcon className="text-destructive" />
        </PageStateIcon>
        <PageStateTitle>{title}</PageStateTitle>
        <PageStateDescription>{description}</PageStateDescription>
      </PageStateHeader>
      <PageStateActions>
        {onRetry ? (
          <Button onClick={onRetry} size="lg">
            {retryLabel}
          </Button>
        ) : null}
        <Button asChild size="lg" variant="outline">
          <a href={homeHref}>{homeLabel}</a>
        </Button>
      </PageStateActions>
    </PageState>
  )
}
