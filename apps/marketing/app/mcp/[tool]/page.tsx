import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { siteConfig } from "@/config/site"
import { marketingEnv } from "@/config/env"
import { mcpTools, mcpToolSlugs } from "@/data/mcp-tools"
import { createMarketingMetadata } from "@/lib/metadata"
import { CtaSection, PlaceholderPage } from "@workspace/ui/components/landing"

interface PageProps {
  params: Promise<{ tool: string }>
}

export function generateStaticParams() {
  return mcpToolSlugs.map((tool) => ({ tool }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tool } = await params
  const config = mcpTools[tool]
  if (!config) return {}

  return createMarketingMetadata({
    title: config.title,
    description: config.description,
    path: `/mcp/${tool}`,
  })
}

export default async function McpToolPage({ params }: PageProps) {
  const { tool } = await params
  const config = mcpTools[tool]
  if (!config) notFound()

  return (
    <>
      <PlaceholderPage description={config.description} title={config.title} />
      <CtaSection
        description={`Connect ${config.title.split(" + ")[0]} to ${siteConfig.name} when you're ready.`}
        href={marketingEnv.appUrl}
        label="Start your trial"
        title="Get early access"
      />
    </>
  )
}
