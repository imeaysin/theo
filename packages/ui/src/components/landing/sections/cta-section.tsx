"use client"

import { Button } from "@workspace/ui/components/button"
import {
  LandingContainer,
  LandingSection,
} from "@workspace/ui/components/landing/layout/page-container"
import type { LandingCtaProps } from "@workspace/ui/components/landing/types"

interface CtaSectionProps extends LandingCtaProps {
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
            variant="inverse"
            size="xl"
            className="px-6"
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
