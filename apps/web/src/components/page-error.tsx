"use client"

import { CircleAlertIcon } from "lucide-react"
import type * as React from "react"
import { Button } from "@workspace/ui-shadcn/components/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui-shadcn/components/empty"
import { cn } from "@workspace/ui-shadcn/lib/utils"

export type PageErrorProps = {
  title?: string
  description?: string
  homeHref?: string
  homeLabel?: string
  retryLabel?: string
  onRetry?: () => void
} & React.ComponentProps<typeof Empty>

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
    <Empty
      className={cn("min-h-[50vh] flex-1 py-16 sm:py-24", className)}
      {...props}
    >
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleAlertIcon className="text-destructive" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {onRetry ? (
            <Button onClick={onRetry} size="lg">
              {retryLabel}
            </Button>
          ) : null}
          <Button
            nativeButton={false}
            render={<a href={homeHref} />}
            size="lg"
            variant="outline"
          >
            {homeLabel}
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  )
}
