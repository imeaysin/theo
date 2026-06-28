import type { ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"

export interface SectionHeadingProps {
  title: string
  subtitle?: string
  className?: string
  children?: ReactNode
  variant?: "section" | "page"
}

const headingVariants = {
  section: {
    wrapper: "mb-10 space-y-4 text-center sm:mb-12",
    title: "font-serif text-2xl text-foreground sm:text-2xl",
    subtitle:
      "mx-auto hidden max-w-2xl font-sans text-base leading-normal text-muted-foreground sm:block",
  },
  page: {
    wrapper: "mb-12 space-y-4 text-center",
    title: "mb-4 font-serif text-3xl text-foreground lg:text-4xl",
    subtitle:
      "mx-auto max-w-2xl font-sans text-base leading-normal text-muted-foreground",
  },
} as const

export function SectionHeading({
  title,
  subtitle,
  className,
  children,
  variant = "section",
}: SectionHeadingProps) {
  const styles = headingVariants[variant]
  const HeadingTag = variant === "page" ? "h1" : "h2"

  return (
    <div className={cn(styles.wrapper, className)}>
      <HeadingTag className={styles.title}>{title}</HeadingTag>
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      {children}
    </div>
  )
}
