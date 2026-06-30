"use client"

import { PageContainer } from "../layout"
import { cn } from "@workspace/ui/lib/utils"

export interface CtaSectionProps {
  title: string
  description: string
  href: string
  label: string
  onClick?: () => void
  className?: string
}

export function CtaSection({
  title,
  description,
  href,
  label,
  onClick,
  className,
}: CtaSectionProps) {
  return (
    <section className={cn("pt-24 pb-24", className)}>
      <PageContainer>
        <div className="relative border border-border bg-background p-8 text-center before:pointer-events-none before:absolute before:inset-0 before:bg-[repeating-linear-gradient(-60deg,rgba(219,219,219,0.4),rgba(219,219,219,0.4)_1px,transparent_1px,transparent_6px)] lg:p-12 dark:before:bg-[repeating-linear-gradient(-60deg,rgba(44,44,44,0.4),rgba(44,44,44,0.4)_1px,transparent_1px,transparent_6px)]">
          <div className="relative z-10">
            <h2 className="mb-4 font-serif text-2xl text-foreground sm:text-2xl">
              {title}
            </h2>
            <p className="mx-auto mb-6 max-w-lg text-base text-muted-foreground">
              {description}
            </p>
            <a
              className="inline-flex items-center justify-center bg-foreground px-6 py-3 text-sm text-background transition-opacity hover:opacity-90"
              href={href}
              onClick={onClick}
            >
              {label}
            </a>
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
