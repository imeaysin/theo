import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { apps } from "@/data/apps"
import { marketingEnv } from "@/config/env"
import { createMarketingMetadata } from "@/lib/metadata"
import { IntegrationDetailSection } from "@workspace/ui/components/landing"

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return apps.map((app) => ({ slug: app.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const app = apps.find((item) => item.slug === slug)
  if (!app) return {}

  return createMarketingMetadata({
    title: `${app.name} integration`,
    description: `Connect ${app.name} to Theo. ${app.short_description}`,
    path: `/integrations/${slug}`,
    og: { title: app.name, description: app.short_description },
  })
}

export default async function IntegrationDetailPage({ params }: PageProps) {
  const { slug } = await params
  const app = apps.find((item) => item.slug === slug)
  if (!app) notFound()

  return (
    <IntegrationDetailSection
      ctaHref={marketingEnv.appUrl}
      description={app.description}
      features={app.features}
      id={app.id}
      logoUrl={app.logoUrl}
      name={app.name}
      shortDescription={app.short_description}
    />
  )
}
