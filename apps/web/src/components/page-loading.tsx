import type * as React from "react"
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
} from "@workspace/ui-shadcn/components/empty"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import { cn } from "@workspace/ui-shadcn/lib/utils"

export type PageLoadingProps = {
  message?: string
} & React.ComponentProps<typeof Empty>

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
      <EmptyMedia>
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
