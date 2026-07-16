import { FileQuestionIcon } from "lucide-react"
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

export type PageNotFoundProps = {
  title?: string
  description?: string
  homeHref?: string
  homeLabel?: string
  action?: React.ReactNode
} & React.ComponentProps<typeof Empty>

export function PageNotFound({
  title = "Page not found",
  description = "The page you're looking for doesn't exist or may have been moved.",
  homeHref = "/",
  homeLabel = "Go home",
  action,
  className,
  ...props
}: PageNotFoundProps) {
  return (
    <Empty
      className={cn("min-h-[50vh] flex-1 py-16 sm:py-24", className)}
      {...props}
    >
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileQuestionIcon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {action ?? (
          <Button nativeButton={false} render={<a href={homeHref} />} size="lg">
            {homeLabel}
          </Button>
        )}
      </EmptyContent>
    </Empty>
  )
}
