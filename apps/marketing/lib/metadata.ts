import type { Metadata } from "next"
import { siteConfig } from "@/config/site"

export interface PageMetadataOptions {
  title: string
  description: string
  path: string
  siteName: string
  baseUrl: string
  og?: { title?: string; description?: string }
  keywords?: string[]
  type?: "website" | "article"
  canonical?: boolean
}

const marketingBaseUrl =
  process.env.NEXT_PUBLIC_MARKETING_URL ?? "http://localhost:3000"

export function createPageMetadata(opts: PageMetadataOptions): Metadata {
  const url = `${opts.baseUrl}${opts.path}`
  const ogTitle = opts.og?.title ?? opts.title
  const ogDescription = opts.og?.description ?? opts.description

  return {
    title: `${opts.title} | ${opts.siteName}`,
    description: opts.description,
    ...(opts.keywords && { keywords: opts.keywords }),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: opts.type ?? "website",
      url,
      siteName: opts.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
    },
    ...(opts.canonical !== false && { alternates: { canonical: url } }),
  }
}

export function createMarketingMetadata(
  opts: Omit<PageMetadataOptions, "siteName" | "baseUrl">
): Metadata {
  return createPageMetadata({
    ...opts,
    siteName: siteConfig.name,
    baseUrl: marketingBaseUrl,
  })
}
