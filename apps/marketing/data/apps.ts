import type { LandingIntegrationItem } from "@workspace/ui/components/landing"

export interface WebsiteApp {
  id: string
  name: string
  slug: string
  category: string
  active: boolean
  beta?: boolean
  short_description: string
  description: string | null
  features: string[]
  installUrl?: string
  logoUrl?: string
}

export function toLandingIntegrations(
  items: WebsiteApp[]
): LandingIntegrationItem[] {
  return items.map((app) => ({
    id: app.id,
    name: app.name,
    slug: app.slug,
    logoUrl: app.logoUrl,
  }))
}

export const apps: WebsiteApp[] = [
  {
    id: "gmail",
    name: "Gmail",
    slug: "gmail",
    category: "capture",
    active: true,
    short_description: "Inbox capture",
    description: null,
    features: [],
    logoUrl: "/images/gmail.svg",
  },
  {
    id: "outlook",
    name: "Outlook",
    slug: "outlook",
    category: "capture",
    active: true,
    short_description: "Inbox capture",
    description: null,
    features: [],
    logoUrl: "/images/outlook.svg",
  },
  {
    id: "slack",
    name: "Slack",
    slug: "slack",
    category: "apps",
    active: true,
    short_description: "Notifications",
    description: null,
    features: [],
    logoUrl: "/images/slack.svg",
  },
  {
    id: "stripe",
    name: "Stripe",
    slug: "stripe",
    category: "payments",
    active: true,
    short_description: "Payments",
    description: null,
    features: [],
    logoUrl: "/images/stripe.svg",
  },
  {
    id: "google-drive",
    name: "Google Drive",
    slug: "google-drive",
    category: "apps",
    active: true,
    short_description: "File storage",
    description: null,
    features: [],
    logoUrl: "/images/gdrive.svg",
  },
  {
    id: "dropbox",
    name: "Dropbox",
    slug: "dropbox",
    category: "apps",
    active: true,
    short_description: "File storage",
    description: null,
    features: [],
    logoUrl: "/images/dropbox.svg",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    slug: "whatsapp",
    category: "apps",
    active: true,
    short_description: "Chat",
    description: null,
    features: [],
    logoUrl: "/images/whatsapp.svg",
  },
  {
    id: "xero",
    name: "Xero",
    slug: "xero",
    category: "accounting",
    active: true,
    short_description: "Accounting",
    description: null,
    features: [],
    logoUrl: "/images/xero.svg",
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    slug: "quickbooks",
    category: "accounting",
    active: true,
    short_description: "Accounting",
    description: null,
    features: [],
    logoUrl: "/images/quickbooks.svg",
  },
  {
    id: "fortnox",
    name: "Fortnox",
    slug: "fortnox",
    category: "accounting",
    active: true,
    short_description: "Accounting",
    description: null,
    features: [],
    logoUrl: "/images/fortnox.svg",
  },
]

export const landingIntegrations = toLandingIntegrations(apps)
