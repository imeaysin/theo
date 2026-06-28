"use client"

import { Button } from "@workspace/ui/components/button"
import { Card, CardPanel } from "@workspace/ui/components/card"
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
        <Card className="rounded-none bg-secondary text-center shadow-none before:hidden">
          <CardPanel className="space-y-6 p-8 sm:p-12">
            <div className="space-y-3">
              <h2 className="font-serif text-2xl text-foreground">{title}</h2>
              {description ? (
                <p className="text-base leading-relaxed text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>
            <Button
              onClick={onClick}
              render={<a href={href} />}
              size="xl"
              variant="default"
            >
              {label}
            </Button>
          </CardPanel>
        </Card>
      </LandingContainer>
    </LandingSection>
  )
}
