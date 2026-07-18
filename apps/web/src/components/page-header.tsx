import type { ReactNode } from "react"
import { cn } from "@workspace/ui-shadcn/lib/utils"

type PageHeaderProps = {
  title: string
  description?: ReactNode
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  )
}

type SectionHeaderProps = {
  title: string
  description?: ReactNode
  actions?: ReactNode
  titleClassName?: string
}

/** Subsection header for settings panels (under a page-level PageHeader). */
export function SectionHeader({
  title,
  description,
  actions,
  titleClassName,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <h2 className={cn("truncate text-sm font-semibold", titleClassName)}>
          {title}
        </h2>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  )
}
