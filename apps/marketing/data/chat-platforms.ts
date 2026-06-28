export interface ChatPlatformStep {
  title: string
  description: string
  href?: string
}

export interface ChatPlatformConfig {
  slug: string
  name: string
  appId: string
  description: string
  steps: ChatPlatformStep[]
  notifications: string[]
  capabilities: string[]
  settingsPath: string
}

export const chatPlatformSlugs = [
  "imessage",
  "slack",
  "whatsapp",
  "telegram",
] as const

export type ChatPlatformSlug = (typeof chatPlatformSlugs)[number]

export const chatPlatforms: Record<ChatPlatformSlug, ChatPlatformConfig> = {
  imessage: {
    slug: "imessage",
    name: "iMessage",
    appId: "imessage",
    description:
      "Connect Theo to iMessage and manage your finances without leaving your conversations. Send a photo of a receipt, ask about your cash flow, create an invoice — Theo handles it all through natural conversation.",
    steps: [
      {
        title: "Open Apps in Theo",
        description:
          "Go to the Apps section in your Theo dashboard and find iMessage.",
      },
      {
        title: "Connect iMessage",
        description:
          "Follow the setup flow on your Mac to link your iMessage account.",
      },
      {
        title: "Start chatting",
        description:
          'Send your first message — try forwarding a receipt or asking "What did I spend this week?"',
      },
    ],
    notifications: [
      "New transactions from connected bank accounts",
      "Invoice status changes (paid, overdue)",
      "Receipt match suggestions",
      "Recurring invoice reminders",
    ],
    capabilities: [
      "Send receipts and PDFs — just snap a photo or forward a document",
      "Create and send invoices through conversation",
      "Track time by telling Theo what you worked on",
      "Ask questions about your finances in plain language",
      "Get real-time notifications for transactions and invoices",
    ],
    settingsPath: "Apps → iMessage → Settings",
  },
  slack: {
    slug: "slack",
    name: "Slack",
    appId: "slack",
    description:
      "Connect Theo to Slack and manage your finances without leaving your workspace. Send a receipt, ask about runway, create an invoice — Theo handles it all through natural conversation.",
    steps: [
      {
        title: "Open Apps in Theo",
        description:
          "Go to the Apps section in your Theo dashboard and find Slack.",
      },
      {
        title: "Install the Slack app",
        description:
          "Authorize Theo in your Slack workspace with the permissions you need.",
      },
      {
        title: "Start chatting",
        description:
          "Message Theo in Slack — try asking about overdue invoices or recent spend.",
      },
    ],
    notifications: [
      "New transactions from connected bank accounts",
      "Invoice status changes (paid, overdue)",
      "Receipt match suggestions",
      "Weekly financial summaries",
    ],
    capabilities: [
      "Upload receipts and documents directly in Slack",
      "Create and send invoices through conversation",
      "Track time by describing what you worked on",
      "Ask questions about your finances in plain language",
      "Get notifications in channels or DMs",
    ],
    settingsPath: "Apps → Slack → Settings",
  },
  whatsapp: {
    slug: "whatsapp",
    name: "WhatsApp",
    appId: "whatsapp",
    description:
      "Connect Theo to WhatsApp and manage your finances without leaving your conversations. Send a photo of a receipt, ask about your cash flow, create an invoice — Theo handles it all through natural conversation.",
    steps: [
      {
        title: "Open Apps in Theo",
        description:
          "Go to the Apps section in your Theo dashboard and find WhatsApp.",
      },
      {
        title: "Connect WhatsApp",
        description:
          "Scan the QR code or copy the connection link to start a chat with the Theo WhatsApp number.",
      },
      {
        title: "Start chatting",
        description:
          'Send your first message — try forwarding a receipt or asking "What did I spend this week?"',
      },
    ],
    notifications: [
      "New transactions from connected bank accounts",
      "Invoice status changes (paid, overdue)",
      "Receipt match suggestions",
      "Recurring invoice reminders",
    ],
    capabilities: [
      "Send receipts and PDFs — just snap a photo or forward a document",
      "Create and send invoices through conversation",
      "Track time by telling Theo what you worked on",
      "Ask questions about your finances in plain language",
      "Get real-time notifications for transactions and invoices",
    ],
    settingsPath: "Apps → WhatsApp → Settings",
  },
  telegram: {
    slug: "telegram",
    name: "Telegram",
    appId: "telegram",
    description:
      "Connect Theo to Telegram and manage your finances on the go. Forward receipts, check balances, and create invoices from any chat.",
    steps: [
      {
        title: "Open Apps in Theo",
        description:
          "Go to the Apps section in your Theo dashboard and find Telegram.",
      },
      {
        title: "Connect Telegram",
        description:
          "Start a chat with the Theo bot using the link from your dashboard.",
      },
      {
        title: "Start chatting",
        description:
          "Send your first message — try asking about this week's expenses or overdue invoices.",
      },
    ],
    notifications: [
      "New transactions from connected bank accounts",
      "Invoice status changes (paid, overdue)",
      "Receipt match suggestions",
      "Payment reminders",
    ],
    capabilities: [
      "Forward receipts and documents in Telegram",
      "Create and send invoices through conversation",
      "Track time with simple messages",
      "Ask questions about your finances in plain language",
      "Get real-time notifications in your chat",
    ],
    settingsPath: "Apps → Telegram → Settings",
  },
}
