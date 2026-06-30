import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CtaSection, IntegrationsGridSection } from "@workspace/ui/landing"
import { marketingEnv } from "@/config/env"
import {
  apps,
  getAppsByCategory,
  getCategoryName,
  getIntegrationFilterTabs,
  integrationCategorySlugs,
} from "@/data/apps"
import { createMarketingMetadata } from "@/lib/metadata"

interface PageProps {
  params: Promise<{ category: string }>
}

function toGridItems(items: typeof apps) {
  return items.map((app) => ({
    id: app.id,
    name: app.name,
    slug: app.slug,
    shortDescription: app.short_description,
    logoUrl: app.logoUrl,
    href: `/integrations/${app.slug}`,
    beta: app.beta,
    active: app.active,
    category: getCategoryName(app.category),
  }))
}

export function generateStaticParams() {
  return integrationCategorySlugs.map((category) => ({ category }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params

  if (!(integrationCategorySlugs as readonly string[]).includes(category)) {
    return {}
  }

  const categoryName = getCategoryName(category)

  return createMarketingMetadata({
    title: `${categoryName} integrations`,
    description: `Connect Theo with ${categoryName.toLowerCase()} tools. Explore our ${categoryName.toLowerCase()} integrations to streamline your financial workflow.`,
    path: `/integrations/category/${category}`,
  })
}

export default async function IntegrationCategoryPage({ params }: PageProps) {
  const { category } = await params

  if (!(integrationCategorySlugs as readonly string[]).includes(category)) {
    notFound()
  }

  const categoryApps = getAppsByCategory(category)
  const categoryName = getCategoryName(category)

  return (
    <>
      <IntegrationsGridSection
        activeCategory={category}
        categories={getIntegrationFilterTabs()}
        items={toGridItems(categoryApps)}
        subtitle={`Connect Theo with ${categoryName.toLowerCase()} tools. Explore integrations to streamline your financial workflow.`}
        title={`${categoryName} integrations`}
      />
      <CtaSection
        description="Connect banks, email, payments, and accounting tools to Theo."
        href={marketingEnv.appUrl}
        label="Start your trial"
        title="Connect your tools"
      />
    </>
  )
}
