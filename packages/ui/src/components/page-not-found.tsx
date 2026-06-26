import { FileQuestionIcon } from "lucide-react"
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

export interface PageNotFoundProps extends React.ComponentProps<typeof PageState> {
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
      <PageStateIcon aria-hidden>
        <FileQuestionIcon />
      </PageStateIcon>
      <div className="space-y-2">
        <PageStateTitle>{title}</PageStateTitle>
        <PageStateDescription>{description}</PageStateDescription>
      </div>
      <PageStateActions>
        {action ?? (
          <Button
            className="px-6"
            render={<a href={homeHref} />}
            size="xl"
            variant="inverse"
          >
            {homeLabel}
          </Button>
        )}
      </PageStateActions>
    </PageState>
  )
}
