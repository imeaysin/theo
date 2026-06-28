"use client"

import { LandingContainer } from "../layout/page-container"
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
              <a
                key={category.id}
                href={category.href}
                className={cn(
                  "border px-4 py-2 font-sans text-sm transition-colors",
                  activeCategory === category.id
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                )}
              >
                {category.name}
              </a>
            ))}
          </div>
        ) : null}

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
                <div className="flex items-center gap-2">
                  <h3 className="font-sans text-sm text-foreground">
                    {item.name}
                  </h3>
                  {item.beta ? (
                    <span className="bg-muted px-2 py-0.5 font-sans text-xs text-primary">
                      Beta
                    </span>
                  ) : null}
                </div>
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
