"use client"

import { CircleAlertIcon } from "lucide-react"
import type * as React from "react"
import { Button } from "@workspace/ui/components/button"
import {
  PageState,
  PageStateActions,
  PageStateDescription,
  PageStateIcon,
  PageStateTitle,
} from "@workspace/ui/components/page-state"
import { cn } from "@workspace/ui/lib/utils"

export interface PageErrorProps extends React.ComponentProps<typeof PageState> {
  title?: string
  description?: string
  homeHref?: string
  homeLabel?: string
  retryLabel?: string
  onRetry?: () => void
}

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
      <PageStateIcon aria-hidden>
        <CircleAlertIcon />
      </PageStateIcon>
      <div className="space-y-2">
        <PageStateTitle>{title}</PageStateTitle>
        <PageStateDescription>{description}</PageStateDescription>
      </div>
      <PageStateActions>
        {onRetry ? (
          <Button onClick={onRetry} size="xl" variant="default">
            {retryLabel}
          </Button>
        ) : null}
        <Button render={<a href={homeHref} />} size="xl" variant="outline">
          {homeLabel}
        </Button>
      </PageStateActions>
    </PageState>
  )
}
