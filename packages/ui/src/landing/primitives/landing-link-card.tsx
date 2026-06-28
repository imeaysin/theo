import type { ReactNode } from "react"
import { Card, CardPanel } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"

export interface LandingLinkCardProps {
  href: string
  children: ReactNode
  className?: string
  panelClassName?: string
  external?: boolean
}

export function LandingLinkCard({
  href,
  children,
  className,
  panelClassName,
  external = false,
}: LandingLinkCardProps) {
  return (
    <Card
      className={cn(
        "rounded-none shadow-none transition-colors before:hidden hover:border-foreground/20 hover:bg-secondary/50",
        className
      )}
      render={
        <a
          href={href}
          rel={external ? "noopener noreferrer" : undefined}
          target={external ? "_blank" : undefined}
        />
      }
    >
      <CardPanel className={cn("p-0", panelClassName)}>{children}</CardPanel>
    </Card>
  )
}
