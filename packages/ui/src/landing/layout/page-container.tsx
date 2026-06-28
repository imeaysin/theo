import type { ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"

interface LandingSectionProps {
  children: ReactNode
  className?: string
  id?: string
}

export function LandingSection({
  children,
  className,
  id,
}: LandingSectionProps) {
  return (
    <section
      id={id}
      className={cn("bg-background py-12 sm:py-16 lg:py-24", className)}
    >
      {children}
    </section>
  )
}

interface LandingContainerProps {
  children: ReactNode
  className?: string
  size?: "default" | "narrow" | "legal"
}

const containerSizes = {
  default: "max-w-(--container-landing)",
  narrow: "max-w-3xl",
  legal: "max-w-4xl",
} as const

export function LandingContainer({
  children,
  className,
  size = "default",
}: LandingContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        containerSizes[size],
        className
      )}
    >
      {children}
    </div>
  )
}
