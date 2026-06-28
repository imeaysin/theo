"use client"

import { Button } from "@workspace/ui/components/button"
import { LandingContainer } from "../layout/page-container"
import { IntegrationLogo } from "../primitives/integration-logo"

export interface DetailPageProps {
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
}: DetailPageProps) {
  return (
    <div className="bg-background pt-32 pb-24">
      <LandingContainer>
        <nav className="mb-8">
          <a
            href={backHref}
            className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← All integrations
          </a>
        </nav>

        <div className="space-y-8">
          <div className="flex items-start gap-6">
            <div className="flex size-16 shrink-0 items-center justify-center border border-border bg-secondary p-3">
              <IntegrationLogo id={id} logoUrl={logoUrl} />
            </div>
            <div className="space-y-2">
              <h1 className="font-serif text-3xl text-foreground lg:text-4xl">
                {name}
              </h1>
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

          <Button render={<a href={ctaHref} />} size="xl" variant="default">
            {ctaLabel}
          </Button>
        </div>
      </LandingContainer>
    </div>
  )
}
