"use client"

import { Button } from "@workspace/ui/components/button"
import {
  LandingContainer,
} from "@workspace/ui/components/landing/layout/page-container"
import { IntegrationLogo } from "@workspace/ui/components/landing/primitives/integration-logo"

export interface IntegrationDetailProps {
  id: string
  name: string
  shortDescription: string
  description?: string | null
  features?: string[]
  logoUrl?: string
  ctaHref: string
  ctaLabel?: string
  backHref?: string
}

export function IntegrationDetailSection({
  id,
  name,
  shortDescription,
  description,
  features = [],
  logoUrl,
  ctaHref,
  ctaLabel = "Get started",
  backHref = "/integrations",
}: IntegrationDetailProps) {
  return (
    <div className="bg-background pb-16 pt-24 sm:pt-32">
      <LandingContainer size="narrow">
        <a
          href={backHref}
          className="mb-8 inline-block font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← All integrations
        </a>

        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="size-14 shrink-0 border border-border bg-secondary p-3">
              <IntegrationLogo id={id} logoUrl={logoUrl} />
            </div>
            <div className="space-y-2">
              <h1 className="font-serif text-3xl text-foreground">{name}</h1>
              <p className="font-sans text-base text-muted-foreground">
                {shortDescription}
              </p>
            </div>
          </div>

          {description ? (
            <p className="font-sans text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : (
            <p className="font-sans text-base leading-relaxed text-muted-foreground">
              Connect {name} to {shortDescription.toLowerCase()} and keep your
              financial records in sync with the rest of your workspace.
            </p>
          )}

          {features.length > 0 ? (
            <ul className="space-y-2 border border-border bg-secondary p-6">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="font-sans text-sm text-foreground before:mr-2 before:content-['—']"
                >
                  {feature}
                </li>
              ))}
            </ul>
          ) : null}

          <Button
            className="px-6"
            render={<a href={ctaHref} />}
            size="xl"
            variant="inverse"
          >
            {ctaLabel}
          </Button>
        </div>
      </LandingContainer>
    </div>
  )
}
