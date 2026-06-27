"use client"

import {
  LandingContainer,
} from "@workspace/ui/components/landing/layout/page-container"
import { SectionHeading } from "@workspace/ui/components/landing/layout/section-heading"
import { IntegrationLogo } from "@workspace/ui/components/landing/primitives/integration-logo"

export interface IntegrationGridItem {
  id: string
  name: string
  slug: string
  shortDescription: string
  logoUrl?: string
  href: string
}

interface IntegrationsGridSectionProps {
  title?: string
  subtitle?: string
  items: IntegrationGridItem[]
}

export function IntegrationsGridSection({
  title = "Apps & integrations",
  subtitle = "Connect the tools you already use to keep your business in sync.",
  items,
}: IntegrationsGridSectionProps) {
  return (
    <div className="bg-background pb-24 pt-32">
      <LandingContainer>
        <SectionHeading title={title} subtitle={subtitle} variant="page" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <a
              key={item.slug}
              href={item.href}
              className="group flex items-start gap-4 border border-border bg-background p-5 transition-colors hover:border-foreground/20 hover:bg-secondary/50"
            >
              <div className="size-10 shrink-0 border border-border bg-secondary p-2">
                <IntegrationLogo id={item.id} logoUrl={item.logoUrl} />
              </div>
              <div className="min-w-0 space-y-1">
                <h3 className="font-sans text-sm text-foreground">{item.name}</h3>
                <p className="font-sans text-sm text-muted-foreground">
                  {item.shortDescription}
                </p>
              </div>
            </a>
          ))}
        </div>
      </LandingContainer>
    </div>
  )
}
