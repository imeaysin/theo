import type { LandingSectionHeadingProps } from "@workspace/ui/components/landing/types"
import { cn } from "@workspace/ui/lib/utils"

export function SectionHeading({
  title,
  subtitle,
  className,
  children,
}: LandingSectionHeadingProps) {
  return (
    <div className={cn("mb-10 space-y-4 text-center sm:mb-12", className)}>
      <h2 className="font-serif text-2xl text-foreground sm:text-2xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mx-auto hidden max-w-2xl px-4 font-sans text-base leading-normal text-muted-foreground sm:block">
          {subtitle}
        </p>
      ) : null}
      {children}
    </div>
  )
}
