export interface NavLink {
  href: string
  label: string
  title?: string
  description?: string
  external?: boolean
}

export const headerFeatureLinks: NavLink[] = [
  {
    href: "/invoicing",
    label: "Invoicing",
    title: "Invoicing",
    description: "Get paid faster",
  },
  {
    href: "/transactions",
    label: "Transactions",
    title: "Transactions",
    description: "All transactions together",
  },
  {
    href: "/inbox",
    label: "Inbox",
    title: "Inbox",
    description: "Receipts handled automatically",
  },
  {
    href: "/time-tracking",
    label: "Time tracking",
    title: "Time tracking",
    description: "See where time goes",
  },
  {
    href: "/customers",
    label: "Customers",
    title: "Customers",
    description: "Know your customers",
  },
  {
    href: "/file-storage",
    label: "Files",
    title: "Files",
    description: "Everything in one place",
  },
  {
    href: "/pre-accounting",
    label: "Exports",
    title: "Exports",
    description: "Accounting ready",
  },
  {
    href: "/assistant",
    label: "Assistant",
    title: "Assistant",
    description: "Ask anything, get things done",
  },
]

export const headerResourceLinksCol1: NavLink[] = [
  {
    href: "/integrations",
    label: "Integrations",
    title: "Integrations",
    description: "Connect your existing tools.",
  },
  {
    href: "/docs",
    label: "Documentation",
    title: "Documentation",
    description: "Learn how to use Theo.",
  },
  {
    href: "/agents",
    label: "CLI",
    title: "CLI",
    description: "Agent-native CLI and MCP workflows.",
  },
  {
    href: "/mcp",
    label: "AI Integrations",
    title: "AI Integrations",
    description: "Connect AI tools to your business data.",
  },
]

export const headerResourceLinksCol2: NavLink[] = [
  {
    href: "https://api.midday.ai",
    label: "Developer & API",
    title: "Developer & API",
    description: "Programmatic access to Theo.",
    external: true,
  },
  {
    href: "/sdks",
    label: "SDKs",
    title: "SDKs",
    description: "Typed SDKs to build faster.",
  },
  {
    href: "/chat",
    label: "Chat",
    title: "Chat",
    description: "Run your business from any chat app.",
  },
  {
    href: "/computer",
    label: "Computer",
    title: "Computer",
    description: "Autonomous agents for your business.",
  },
]

export const headerResourceLinks = [
  ...headerResourceLinksCol1,
  ...headerResourceLinksCol2,
]

export const featurePrefetchRoutes = headerFeatureLinks.map((link) => link.href)

export const appPrefetchRoutes = [
  "/integrations",
  "/download",
  "/docs",
  "/agents",
  "/computer",
  "/mcp",
]

export const footerNavigation = {
  features: headerFeatureLinks.map(({ href, label }) => ({ href, label })),
  product: [
    { href: "/download", label: "Download" },
    { href: "/pre-accounting", label: "Pre-accounting" },
    { href: "/integrations", label: "Apps & Integrations" },
    { href: "/testimonials", label: "Customer Stories" },
  ],
  company: [
    { href: "/story", label: "Story", external: false },
    { href: "/updates", label: "Updates", external: false },
  ],
  resources: [
    { href: "/chat", label: "Chat", external: false },
    { href: "/docs", label: "Documentation", external: false },
    { href: "/agents", label: "CLI", external: false },
    { href: "/computer", label: "Computer", external: false },
    { href: "/sdks", label: "SDKs", external: false },
    { href: "/support", label: "Support", external: false },
    { href: "/policy", label: "Privacy Policy", external: false },
    { href: "/terms", label: "Terms of Service", external: false },
  ],
} as const

export const socialLinks = {
  twitter: "https://x.com/middayai",
  linkedin: "https://www.linkedin.com/company/midday-ai",
  status: "https://midday.openstatus.dev/",
  api: "https://api.midday.ai",
} as const
