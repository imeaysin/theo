import type { ReactNode } from "react"

type AuthCardProps = {
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-xl font-bold">{title}</h1>
        {description && (
          <div className="text-sm text-muted-foreground">{description}</div>
        )}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
      {footer && (
        <div className="px-6 text-center text-xs text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  )
}
