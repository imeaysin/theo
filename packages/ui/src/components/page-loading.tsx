import type * as React from "react"
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
} from "@workspace/ui/components/empty"
import { Spinner } from "@workspace/ui/components/spinner"
import { cn } from "@workspace/ui/lib/utils"

export interface PageLoadingProps extends React.ComponentProps<typeof Empty> {
  message?: string
}

export function PageLoading({
  message,
  className,
  ...props
}: PageLoadingProps) {
  return (
    <Empty
      aria-busy="true"
      aria-live="polite"
      className={cn("min-h-[50vh] flex-1 gap-4 py-16 sm:py-24", className)}
      role="status"
      {...props}
    >
      <EmptyMedia className="mb-0">
        <Spinner className="size-8 text-primary" />
      </EmptyMedia>
      {message ? (
        <EmptyDescription>{message}</EmptyDescription>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </Empty>
  )
}
