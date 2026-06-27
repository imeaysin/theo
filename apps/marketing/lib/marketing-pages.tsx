import type { Metadata } from "next"
import type { ReactElement } from "react"
import { notFound } from "next/navigation"
import { FeaturePageTemplate } from "@/components/templates/feature-page-template"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { siteConfig } from "@/config/site"
import { marketingEnv } from "@/config/env"
import { apps, integrationCategories } from "@/data/apps"
import { defaultFaqItems } from "@/data/faq"
import { featurePages, featurePageSlugs } from "@/data/feature-pages"
import { privacyDocument, termsDocument } from "@/data/legal"
import {
  mcpCapabilities,
  mcpClients,
  mcpSampleQuestions,
} from "@/data/mcp-clients"
import { placeholderPages } from "@/data/placeholder-pages"
import { updatesItems } from "@/data/updates"
import { createMarketingMetadata } from "@/lib/metadata"
import {
  CtaSection,
  IntegrationsGridSection,
  LegalPage,
  McpHubSection,
  PlaceholderPage,
  ResourcePageShell,
  UpdatesListSection,
} from "@workspace/ui/components/landing"

interface PageMeta {
  title: string
  description: string
  path: string
  og?: { title?: string; description?: string }
  keywords?: string[]
}

interface StaticPageEntry {
  meta: PageMeta
  render: () => ReactElement
}

function ctaBlock(title: string, description?: string) {
  return (
    <CtaSection
      description={description}
      href={marketingEnv.appUrl}
      label="Start your trial"
      title={title}
    />
  )
}

function integrationGridItems() {
  return apps.map((app) => ({
    id: app.id,
    name: app.name,
    slug: app.slug,
    shortDescription: app.short_description,
    logoUrl: app.logoUrl,
    href: `/integrations/${app.slug}`,
    beta: app.beta,
  }))
}

function buildStaticPages(): Record<string, StaticPageEntry> {
  const pages: Record<string, StaticPageEntry> = {}

  for (const slug of featurePageSlugs) {
    const page = featurePages[slug]
    if (!page) continue
    pages[slug] = {
      meta: { ...page.meta, path: `/${slug}` },
      render: () => <FeaturePageTemplate page={page} />,
    }
  }

  pages.integrations = {
    meta: {
      title: "Apps & integrations",
      description:
        "Connect banks, email, payments, and accounting tools to Theo.",
      path: "/integrations",
      og: { title: "Integrations", description: "Connect your stack" },
    },
    render: () => (
      <>
        <IntegrationsGridSection
          activeCategory="all"
          categories={[...integrationCategories]}
          items={integrationGridItems()}
        />
        {ctaBlock("Connect your tools")}
      </>
    ),
  }

  pages.testimonials = {
    meta: {
      title: "Customer stories",
      description: "See how founders use Theo to run their business.",
      path: "/testimonials",
      og: { title: "Customer stories", description: "Founder testimonials" },
    },
    render: () => (
      <>
        <TestimonialsSection title="Founders on Theo" />
        {ctaBlock("Join them")}
      </>
    ),
  }

  pages.story = {
    meta: {
      title: "Our story",
      description: `Why we built ${siteConfig.name} for modern founders.`,
      path: "/story",
    },
    render: () => (
      <PlaceholderPage
        action={
          <a
            href={marketingEnv.appUrl}
            className="inline-flex h-11 items-center border border-transparent bg-foreground px-6 font-sans text-sm text-background transition-colors hover:bg-foreground/90"
          >
            Start your trial
          </a>
        }
        description={`${siteConfig.name} exists because founders shouldn't spend weekends on admin. We're building the business stack that replaces the tools you've outgrown — invoicing, reconciliation, time tracking, and exports in one calm workspace.`}
        title="Our story"
        variant="story"
      />
    ),
  }

  pages.updates = {
    meta: {
      title: "Updates",
      description: "Product news and announcements from Theo.",
      path: "/updates",
    },
    render: () => (
      <>
        <UpdatesListSection items={updatesItems} />
        {ctaBlock("Try Theo today")}
      </>
    ),
  }

  pages.terms = {
    meta: {
      title: "Terms and Conditions",
      description:
        "Terms and Conditions for using Theo. Read about your rights and responsibilities when using our service.",
      path: "/terms",
      og: { title: "Terms", description: "Your rights and responsibilities" },
    },
    render: () => <LegalPage document={termsDocument} />,
  }

  pages.policy = {
    meta: {
      title: "Privacy Policy",
      description: "How Theo collects, uses, and protects your data.",
      path: "/policy",
    },
    render: () => <LegalPage document={privacyDocument} />,
  }

  pages.mcp = {
    meta: {
      title: "AI Integrations via MCP — Claude, ChatGPT, Cursor & More",
      description:
        "Run your business from any AI tool via Model Context Protocol (MCP). Create invoices, export to your accountant, track time, and manage transactions from Cursor, Claude, ChatGPT, Raycast, or Zapier.",
      path: "/mcp",
      og: {
        title: "AI Integrations",
        description: "Run your business from any AI tool via MCP",
      },
      keywords: [
        "MCP",
        "Model Context Protocol",
        "AI integration",
        "Claude MCP",
        "Cursor MCP",
        "business automation",
      ],
    },
    render: () => (
      <>
        <McpHubSection
          capabilities={mcpCapabilities}
          clients={mcpClients}
          productName={siteConfig.name}
          sampleQuestions={mcpSampleQuestions}
        />
        {ctaBlock("Connect your AI tools")}
      </>
    ),
  }

  for (const [slug, content] of Object.entries(placeholderPages)) {
    pages[slug] = {
      meta: {
        title: content.title,
        description: content.description,
        path: `/${slug}`,
      },
      render: () => (
        <ResourcePageShell
          ctaHref={marketingEnv.appUrl}
          ctaTitle={`Get started with ${siteConfig.name}`}
          description={content.description}
          faqItems={defaultFaqItems}
          title={content.title}
        />
      ),
    }
  }

  return pages
}

export const marketingStaticPages = buildStaticPages()

export const marketingStaticSlugs = Object.keys(marketingStaticPages)

export function getMarketingPage(slug: string): StaticPageEntry | undefined {
  return marketingStaticPages[slug]
}

export function getMarketingPageMetadata(slug: string): Metadata | undefined {
  const page = getMarketingPage(slug)
  if (!page) return undefined
  return createMarketingMetadata(page.meta)
}

export function renderMarketingPage(slug: string): ReactElement {
  const page = getMarketingPage(slug)
  if (!page) notFound()
  return page.render()
}
