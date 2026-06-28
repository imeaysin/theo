import type { ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"

export interface LandingPageHeroProps {
  eyebrow?: string
  title: string
  description?: string
  children?: ReactNode
  className?: string
  titleClassName?: string
}

export function LandingPageHero({
  eyebrow,
  title,
  description,
  children,
  className,
  titleClassName,
}: LandingPageHeroProps) {
  return (
    <div className={cn("space-y-4 text-center", className)}>
      {eyebrow ? (
        <p className="text-xs tracking-wider text-muted-foreground uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h1
        className={cn(
          "font-serif text-3xl leading-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl",
          titleClassName
        )}
      >
        {title}
      </h1>
      {description ? (
        <p className="mx-auto max-w-2xl text-base leading-normal text-muted-foreground">
          {description}
        </p>
      ) : null}
      {children}
    </div>
  )
}
