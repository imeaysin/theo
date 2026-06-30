"use client"

import { PageContainer, SectionHeading } from "../layout"
import { IntegrationLogo } from "../integration-logo"
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
  active?: boolean
  category?: string
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
      <PageContainer>
        <SectionHeading title={title} subtitle={subtitle} variant="page" />

        {categories?.length ? (
          <div className="mb-12 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <a
                key={category.id}
                href={category.href}
                className={cn(
                  "border px-4 py-2 text-sm transition-colors",
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <a
              key={item.slug}
              href={item.href}
              className="group flex flex-col border border-border p-6 transition-all duration-200 hover:border-foreground/20"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg">
                  <IntegrationLogo id={item.id} logoUrl={item.logoUrl} />
                </div>
                <div className="flex gap-1">
                  {item.beta ? (
                    <span className="bg-muted px-2 py-1 text-xs text-primary">
                      Beta
                    </span>
                  ) : null}
                  {item.active === false ? (
                    <span className="bg-muted px-2 py-1 text-xs text-muted-foreground">
                      Coming soon
                    </span>
                  ) : null}
                </div>
              </div>
              <h3 className="mb-2 text-lg text-foreground">{item.name}</h3>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                {item.shortDescription}
              </p>
              {item.category ? (
                <div className="mt-4 border-t border-border pt-4">
                  <span className="text-xs text-muted-foreground">
                    {item.category}
                  </span>
                </div>
              ) : null}
            </a>
          ))}
        </div>
      </PageContainer>
    </div>
  )
}
