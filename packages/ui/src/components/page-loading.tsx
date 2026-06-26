import type * as React from "react"
import { Spinner } from "@workspace/ui/components/spinner"
import {
  PageState,
  PageStateDescription,
} from "@workspace/ui/components/page-state"
import { cn } from "@workspace/ui/lib/utils"

export interface PageLoadingProps extends React.ComponentProps<typeof PageState> {
  message?: string
}

export function PageLoading({
  message,
  className,
  ...props
}: PageLoadingProps) {
  return (
    <PageState
      aria-live="polite"
      className={cn(className)}
      role="status"
      {...props}
    >
      <div className="flex size-14 items-center justify-center border border-border bg-secondary">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
      {message ? <PageStateDescription>{message}</PageStateDescription> : null}
    </PageState>
  )
}
