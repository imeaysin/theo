export const footerNavigation = {
  features: [
    { href: "/invoicing", label: "Invoicing" },
    { href: "/transactions", label: "Transactions" },
    { href: "/inbox", label: "Inbox" },
    { href: "/time-tracking", label: "Time tracking" },
    { href: "/customers", label: "Customers" },
    { href: "/file-storage", label: "Files" },
    { href: "/pre-accounting", label: "Exports" },
    { href: "/assistant", label: "Assistant" },
  ],
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
