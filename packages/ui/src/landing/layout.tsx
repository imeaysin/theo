import type { ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"

interface PageSectionProps {
  children: ReactNode
  className?: string
  id?: string
}

export function PageSection({ children, className, id }: PageSectionProps) {
  return (
    <section
      id={id}
      className={cn("bg-background py-12 sm:py-16 lg:py-24", className)}
    >
      {children}
    </section>
  )
}

interface PageContainerProps {
  children: ReactNode
  className?: string
  size?: "default" | "narrow" | "legal"
}

const containerSizes = {
  default: "max-w-(--container-landing)",
  narrow: "max-w-3xl",
  legal: "max-w-4xl",
} as const

export function PageContainer({
  children,
  className,
  size = "default",
}: PageContainerProps) {
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

export interface SectionHeadingProps {
  title: string
  subtitle?: string
  eyebrow?: string
  className?: string
  children?: ReactNode
  variant?: "section" | "page" | "hero"
  titleClassName?: string
}

const headingVariants = {
  section: {
    wrapper: "mb-10 space-y-4 text-center sm:mb-12",
    tag: "h2" as const,
    title: "font-serif text-2xl text-foreground sm:text-2xl",
    subtitle:
      "mx-auto hidden max-w-2xl text-base leading-normal text-muted-foreground sm:block",
  },
  page: {
    wrapper: "mb-12 space-y-4 text-center",
    tag: "h1" as const,
    title: "mb-4 font-serif text-3xl text-foreground lg:text-4xl",
    subtitle:
      "mx-auto max-w-2xl text-base leading-normal text-muted-foreground",
  },
  hero: {
    wrapper: "space-y-4 text-center",
    tag: "h1" as const,
    title:
      "font-serif text-3xl leading-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl",
    subtitle:
      "mx-auto max-w-2xl text-base leading-normal text-muted-foreground",
  },
} as const

export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  className,
  children,
  variant = "section",
  titleClassName,
}: SectionHeadingProps) {
  const styles = headingVariants[variant]
  const HeadingTag = styles.tag

  return (
    <div className={cn(styles.wrapper, className)}>
      {eyebrow ? (
        <p className="text-xs tracking-wider text-muted-foreground uppercase">
          {eyebrow}
        </p>
      ) : null}
      <HeadingTag className={cn(styles.title, titleClassName)}>
        {title}
      </HeadingTag>
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      {children}
    </div>
  )
}
