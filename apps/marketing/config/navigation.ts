import React from "react"

export interface NavItem {
  title?: string
  href: string
  disabled?: boolean
  external?: boolean
  icon?: React.ElementType
  label: string
  description?: string
}

export const appPrefetchRoutes: string[] = []
export const featurePrefetchRoutes: string[] = [
  "/invoicing",
  "/transactions",
  "/inbox",
  "/time-tracking",
  "/customers",
  "/files",
  "/exports",
  "/assistant",
]

export const headerFeatureLinks: NavItem[] = [
  {
    title: "Invoicing",
    label: "Invoicing",
    href: "/invoicing",
    description: "Get paid faster",
  },
  {
    title: "Transactions",
    label: "Transactions",
    href: "/transactions",
    description: "All transactions together",
  },
  {
    title: "Inbox",
    label: "Inbox",
    href: "/inbox",
    description: "Receipts handled automatically",
  },
  {
    title: "Time tracking",
    label: "Time tracking",
    href: "/time-tracking",
    description: "See where time goes",
  },
  {
    title: "Customers",
    label: "Customers",
    href: "/customers",
    description: "Know your customers",
  },
  {
    title: "Files",
    label: "Files",
    href: "/files",
    description: "Everything in one place",
  },
  {
    title: "Exports",
    label: "Exports",
    href: "/exports",
    description: "Accounting ready",
  },
  {
    title: "Assistant",
    label: "Assistant",
    href: "/assistant",
    description: "Ask anything, get things done",
  },
]

export const headerResourceLinksCol1: NavItem[] = [
  {
    title: "Help Center",
    label: "Help Center",
    href: "https://help.midday.ai",
    description: "Learn how to use Theo",
    external: true,
  },
  {
    title: "API Documentation",
    label: "API Documentation",
    href: "/docs",
    description: "Build with our API",
  },
]
export const headerResourceLinksCol2: NavItem[] = [
  {
    title: "Blog",
    label: "Blog",
    href: "/blog",
    description: "Latest news and updates",
  },
  {
    title: "Changelog",
    label: "Changelog",
    href: "/changelog",
    description: "See what's new",
  },
]
export const headerResourceLinks: NavItem[] = [
  ...headerResourceLinksCol1,
  ...headerResourceLinksCol2,
]

export const footerNavigation = {
  features: [] as NavItem[],
  product: [] as NavItem[],
  company: [] as NavItem[],
  resources: [] as NavItem[],
}

export const socialLinks = {
  twitter: "https://twitter.com",
  linkedin: "https://linkedin.com",
  api: "https://api.example.com",
  status: "https://status.example.com",
}
