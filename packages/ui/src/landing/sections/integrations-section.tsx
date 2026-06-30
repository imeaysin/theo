"use client"

import type { ReactNode } from "react"
import { Button } from "@workspace/ui/components/button"
import { PageContainer, PageSection, SectionHeading } from "../layout"
import { IntegrationLogo } from "../integration-logo"
import { cn } from "@workspace/ui/lib/utils"

export interface LogoLinkItem {
  id: string
  name: string
  slug: string
  logoUrl?: string
}

interface IntegrationsSectionProps {
  title?: string
  subtitle?: string
  apps: LogoLinkItem[]
  integrationsHref?: string
  getIntegrationHref?: (slug: string) => string
}

function IntegrationPill({
  href,
  logo,
  label,
  className,
}: {
  href: string
  logo: ReactNode
  label: string
  className?: string
}) {
  return (
    <a
      className={cn(
        "flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm whitespace-nowrap transition-colors hover:border-foreground/20",
        className
      )}
      href={href}
    >
      <span className="flex size-4 shrink-0 items-center justify-center [&_img]:size-full [&_img]:object-contain [&_svg]:size-full">
        {logo}
      </span>
      <span className="text-foreground">{label}</span>
    </a>
  )
}

function MarqueeRow({
  apps,
  direction,
  getIntegrationHref,
}: {
  apps: LogoLinkItem[]
  direction: "left" | "right"
  getIntegrationHref: (slug: string) => string
}) {
  const animationClass =
    direction === "left" ? "animate-marquee-left" : "animate-marquee-right"

  return (
    <div
      className={`flex ${animationClass} will-change-transform group-hover/integrations:[animation-play-state:paused]`}
    >
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1 ? true : undefined}
          className="flex shrink-0 gap-2 pr-2"
        >
          {apps.map((app) => (
            <IntegrationPill
              key={`${copy}-${app.id}`}
              href={getIntegrationHref(app.slug)}
              label={app.name}
              logo={<IntegrationLogo id={app.id} logoUrl={app.logoUrl} />}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function IntegrationsSection({
  title = "Works with the tools you already use",
  subtitle = "Connect your banks, email, payments and accounting software in minutes.",
  apps,
  integrationsHref = "/integrations",
  getIntegrationHref = (slug) => `/integrations/${slug}`,
}: IntegrationsSectionProps) {
  const midpoint = Math.ceil(apps.length / 2)
  const row1Apps = apps.slice(0, midpoint)
  const row2Apps = apps.slice(midpoint)

  return (
    <PageSection>
      <PageContainer>
        <SectionHeading title={title} subtitle={subtitle} />

        <div className="group/integrations relative overflow-hidden">
          <div className="marquee-fade-left pointer-events-none absolute inset-y-0 left-0 z-10 w-24 sm:w-32" />
          <div className="marquee-fade-right pointer-events-none absolute inset-y-0 right-0 z-10 w-24 sm:w-32" />

          <div className="space-y-3">
            <MarqueeRow
              apps={row1Apps}
              direction="left"
              getIntegrationHref={getIntegrationHref}
            />
            <MarqueeRow
              apps={row2Apps}
              direction="right"
              getIntegrationHref={getIntegrationHref}
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button
            render={<a href={integrationsHref} />}
            size="sm"
            variant="link"
          >
            View all integrations
          </Button>
        </div>
      </PageContainer>
    </PageSection>
  )
}
