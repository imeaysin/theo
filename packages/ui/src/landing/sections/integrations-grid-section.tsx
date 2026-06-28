"use client"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { LandingContainer } from "../layout/page-container"
import { LandingLinkCard } from "../primitives/landing-link-card"
import { SectionHeading } from "../layout/section-heading"
import { IntegrationLogo } from "../primitives/integration-logo"
import { cn } from "@workspace/ui/lib/utils"

export interface FilterTab {
  id: string
  name: string
  href: string
}

export interface CatalogItem {
  id: string
  name: string
  slug: string
  shortDescription: string
  logoUrl?: string
  href: string
  beta?: boolean
}

interface IntegrationsGridSectionProps {
  title?: string
  subtitle?: string
  items: CatalogItem[]
  categories?: FilterTab[]
  activeCategory?: string
}

export function IntegrationsGridSection({
  title = "Catalog",
  subtitle = "Browse available options.",
  items,
  categories,
  activeCategory = "all",
}: IntegrationsGridSectionProps) {
  return (
    <div className="bg-background pt-32 pb-24">
      <LandingContainer>
        <SectionHeading title={title} subtitle={subtitle} variant="page" />

        {categories?.length ? (
          <div className="mb-12 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                className={cn(
                  activeCategory === category.id &&
                    "border-foreground bg-foreground text-background hover:bg-foreground/90"
                )}
                render={<a href={category.href} />}
                size="sm"
                variant="outline"
              >
                {category.name}
              </Button>
            ))}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <LandingLinkCard
              key={item.slug}
              className="group"
              href={item.href}
              panelClassName="flex items-start gap-4 p-5"
            >
              <div className="size-10 shrink-0 border border-border bg-secondary p-2">
                <IntegrationLogo id={item.id} logoUrl={item.logoUrl} />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm text-foreground">{item.name}</h3>
                  {item.beta ? (
                    <Badge size="sm" variant="secondary">
                      Beta
                    </Badge>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.shortDescription}
                </p>
              </div>
            </LandingLinkCard>
          ))}
        </div>
      </LandingContainer>
    </div>
  )
}
