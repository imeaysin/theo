"use client"

import { Button } from "@workspace/ui/components/button"
import { LandingContainer, LandingSection } from "../layout/page-container"

export interface CtaSectionProps {
  title: string
  description?: string
  href: string
  label: string
  onClick?: () => void
}

export function CtaSection({
  title,
  description,
  href,
  label,
  onClick,
  className,
}: CtaSectionProps & { className?: string }) {
  return (
    <LandingSection className={className}>
      <LandingContainer size="narrow">
        <div className="space-y-6 border border-border bg-secondary p-8 text-center sm:p-12">
          <div className="space-y-3">
            <h2 className="font-serif text-2xl text-foreground">{title}</h2>
            {description ? (
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          <Button
            size="xl"
            variant="default"
            onClick={onClick}
            render={<a href={href} />}
          >
            {label}
          </Button>
        </div>
      </LandingContainer>
    </LandingSection>
  )
}
