import type { ReactNode } from "react"
import { Card } from "@workspace/hero-ui"

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
    <Card className="w-full max-w-md border-border/80 shadow-sm">
      <Card.Header>
        <Card.Title>{title}</Card.Title>
        {description ? (
          <Card.Description>{description}</Card.Description>
        ) : null}
      </Card.Header>
      <Card.Content className="flex flex-col gap-4">{children}</Card.Content>
      {footer ? (
        <div className="border-t border-border px-6 py-4 text-center text-sm text-muted-foreground">
          {footer}
        </div>
      ) : null}
    </Card>
  )
}
