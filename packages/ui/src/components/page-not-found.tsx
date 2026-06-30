import { FileQuestionIcon } from "lucide-react"
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

export interface PageNotFoundProps extends React.ComponentProps<
  typeof PageState
> {
  title?: string
  description?: string
  homeHref?: string
  homeLabel?: string
  action?: React.ReactNode
}

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
    <PageState className={cn(className)} {...props}>
      <PageStateHeader>
        <PageStateIcon>
          <FileQuestionIcon />
        </PageStateIcon>
        <PageStateTitle>{title}</PageStateTitle>
        <PageStateDescription>{description}</PageStateDescription>
      </PageStateHeader>
      <PageStateActions>
        {action ?? (
          <Button render={<a href={homeHref} />} size="lg">
            {homeLabel}
          </Button>
        )}
      </PageStateActions>
    </PageState>
  )
}
