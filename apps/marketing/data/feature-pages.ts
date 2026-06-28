import type { FeatureItem } from "@workspace/ui/landing"

export interface FeaturePageConfig {
  slug: string
  eyebrow: string
  title: string
  description: string
  mobileDescription?: string
  meta: {
    title: string
    description: string
    og?: { title?: string; description?: string }
    keywords?: string[]
  }
}

export const featurePages: Record<string, FeaturePageConfig> = {
  invoicing: {
    slug: "invoicing",
    eyebrow: "Invoicing",
    title: "Get paid faster",
    description:
      "Create invoices, send them to customers, and track payments while every update flows directly into your overview.",
    mobileDescription: "Create and send invoices and track their status.",
    meta: {
      title: "Online invoicing for small business",
      description:
        "Create professional invoices, track payments, and get paid faster with invoicing built for founders.",
      og: { title: "Invoicing", description: "Get paid faster" },
      keywords: ["invoice software", "small business invoicing", "billing"],
    },
  },
  transactions: {
    slug: "transactions",
    eyebrow: "Transactions",
    title: "Every transaction, organized",
    description:
      "Connect your banks and see money in and out with automatic categorization and clean reconciliation.",
    meta: {
      title: "Transaction management",
      description:
        "Import, categorize, and reconcile transactions from 25,000+ banks in one place.",
      og: { title: "Transactions", description: "Money movement, organized" },
    },
  },
  inbox: {
    slug: "inbox",
    eyebrow: "Inbox",
    title: "Receipts matched automatically",
    description:
      "Pull receipts and invoices from email, match them to transactions, and stop chasing paperwork.",
    meta: {
      title: "Receipt inbox",
      description:
        "Automatic receipt capture and transaction matching from email and uploads.",
      og: { title: "Inbox", description: "Receipt matching on autopilot" },
    },
  },
  "time-tracking": {
    slug: "time-tracking",
    eyebrow: "Time tracking",
    title: "Track time, bill with confidence",
    description:
      "Log hours by project and customer, then turn tracked time into invoices without re-entering data.",
    meta: {
      title: "Time tracking",
      description:
        "Track billable hours and connect time entries directly to invoicing.",
      og: { title: "Time tracking", description: "Hours that bill themselves" },
    },
  },
  customers: {
    slug: "customers",
    eyebrow: "Customers",
    title: "Know every customer relationship",
    description:
      "See revenue, invoices, and activity per customer so you always know who drives the business.",
    meta: {
      title: "Customer management",
      description:
        "Customer profiles with invoices, payments, and performance in one view.",
      og: { title: "Customers", description: "Relationships with context" },
    },
  },
  "file-storage": {
    slug: "file-storage",
    eyebrow: "Files",
    title: "Documents where you need them",
    description:
      "Store contracts, receipts, and exports in a vault linked to transactions and customers.",
    meta: {
      title: "File storage",
      description:
        "Secure document storage connected to your financial records.",
      og: { title: "Files", description: "Your document vault" },
    },
  },
  "pre-accounting": {
    slug: "pre-accounting",
    eyebrow: "Pre-accounting",
    title: "Books ready for your accountant",
    description:
      "Clean, categorized records and export-ready reports without end-of-month panic.",
    meta: {
      title: "Pre-accounting & exports",
      description:
        "Automatic categorization and export-ready books for your accountant.",
      og: { title: "Pre-accounting", description: "Export-ready books" },
    },
  },
  assistant: {
    slug: "assistant",
    eyebrow: "Assistant",
    title: "Ask questions about your business",
    description:
      "Get answers about revenue, expenses, runway, and trends from your real data — in plain language.",
    meta: {
      title: "AI assistant",
      description:
        "Natural language insights on cash flow, revenue, and business performance.",
      og: { title: "Assistant", description: "Financial answers on demand" },
    },
  },
  insights: {
    slug: "insights",
    eyebrow: "Insights",
    title: "See what changed and why",
    description:
      "Dashboards and weekly summaries that highlight what matters without digging through spreadsheets.",
    meta: {
      title: "Financial insights",
      description:
        "Runway, burn rate, and category breakdowns updated automatically.",
      og: { title: "Insights", description: "Clarity without spreadsheets" },
    },
  },
}

export const defaultFeatureGridItems: FeatureItem[] = [
  {
    href: "/invoicing",
    icon: "description",
    title: "Invoicing",
    description: "Invoice management",
  },
  {
    href: "/transactions",
    icon: "list_alt",
    title: "Transactions",
    description: "Money movement",
  },
  {
    href: "/inbox",
    icon: "inbox",
    title: "Inbox",
    description: "Receipt matching",
  },
  {
    href: "/time-tracking",
    icon: "timer",
    title: "Time tracking",
    description: "Project hours",
  },
  {
    href: "/customers",
    icon: "scatter_plot",
    title: "Customers",
    description: "Customer performance",
  },
  {
    href: "/file-storage",
    icon: "folder_zip",
    title: "Files",
    description: "Document storage",
  },
  {
    href: "/pre-accounting",
    icon: "arrow_outward",
    title: "Exports",
    description: "Accounting ready",
  },
  {
    href: "/mcp",
    icon: "widgets",
    title: "AI integrations",
    description: "Connect your tools",
  },
]

export const featurePageSlugs = Object.keys(featurePages)
