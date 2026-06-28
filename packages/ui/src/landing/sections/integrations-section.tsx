"use client"

import { LandingContainer, LandingSection } from "../layout/page-container"
import { SectionHeading } from "../layout/section-heading"
import { IntegrationLogo } from "../primitives/integration-logo"

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

function IntegrationPill({ app, href }: { app: LogoLinkItem; href: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 whitespace-nowrap transition-colors hover:border-foreground/20"
    >
      <div className="h-4 w-4 shrink-0">
        <IntegrationLogo id={app.id} logoUrl={app.logoUrl} />
      </div>
      <span className="font-sans text-sm text-foreground">{app.name}</span>
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
      className={`flex ${animationClass} will-change-transform group-hover/integrations:paused`}
    >
      {[0, 1].map((copy) => (
        <div
          key={copy}
          className="flex shrink-0 gap-2 pr-2"
          aria-hidden={copy === 1 ? true : undefined}
        >
          {apps.map((app) => (
            <IntegrationPill
              key={`${copy}-${app.id}`}
              app={app}
              href={getIntegrationHref(app.slug)}
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
    <LandingSection>
      <LandingContainer>
        <SectionHeading title={title} subtitle={subtitle} />

        <div className="group/integrations relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 sm:w-32"
            style={{
              background:
                "linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background)) 30%, hsla(var(--background), 0.8) 50%, hsla(var(--background), 0.4) 70%, transparent 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 sm:w-32"
            style={{
              background:
                "linear-gradient(to left, hsl(var(--background)) 0%, hsl(var(--background)) 30%, hsla(var(--background), 0.8) 50%, hsla(var(--background), 0.4) 70%, transparent 100%)",
            }}
          />

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
          <a
            href={integrationsHref}
            className="font-sans text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          >
            View all integrations
          </a>
        </div>
      </LandingContainer>
    </LandingSection>
  )
}
