"use client"

import { Button } from "@workspace/ui-shadcn/components/button"
import { Card, CardContent } from "@workspace/ui-shadcn/components/card"
import { PageContainer } from "../layout"
import { IntegrationLogo } from "../integration-logo"

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
      <PageContainer>
        <nav className="mb-8">
          <Button
            className="h-auto p-0 text-sm text-muted-foreground"

            variant="link"
          >
            <a href={backHref}>← All integrations</a>
          </Button>
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
              <p className="text-base text-muted-foreground">
                {shortDescription}
              </p>
            </div>
          </div>

          {description ? (
            <p className="text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : (
            <p className="text-base leading-relaxed text-muted-foreground">
              Connect {name} to {shortDescription.toLowerCase()} and keep your
              financial records in sync with the rest of your workspace.
            </p>
          )}

          {features.length > 0 ? (
            <Card className="rounded-none bg-secondary shadow-none before:hidden">
              <CardContent className="space-y-2">
                {features.map((feature) => (
                  <p
                    key={feature}
                    className="text-sm text-foreground before:mr-2 before:content-['—']"
                  >
                    {feature}
                  </p>
                ))}
              </CardContent>
            </Card>
          ) : null}

          <Button size="lg" variant="default">
            <a href={ctaHref}>{ctaLabel}</a>
          </Button>
        </div>
      </PageContainer>
    </div>
  )
}
