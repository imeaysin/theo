import type { Metadata } from "next"
import {
  getMarketingPageMetadata,
  marketingStaticSlugs,
  renderMarketingPage,
} from "@/lib/marketing-pages"

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return marketingStaticSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  return getMarketingPageMetadata(slug) ?? {}
}

export default async function MarketingStaticPage({ params }: PageProps) {
  const { slug } = await params
  return renderMarketingPage(slug)
}
