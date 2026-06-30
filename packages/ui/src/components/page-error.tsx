"use client"

import { CircleAlertIcon } from "lucide-react"
import type * as React from "react"
import { Button } from "@workspace/ui/components/button"
import {
  PageState,
  PageStateActions,
  PageStateDescription,
  PageStateHeader,
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
        <Button render={<a href={homeHref} />} size="lg" variant="outline">
          {homeLabel}
        </Button>
      </PageStateActions>
    </PageState>
  )
}
