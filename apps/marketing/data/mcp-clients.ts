export interface McpClient {
  id: string
  name: string
  description: string
  href: string
}

export const mcpClients: McpClient[] = [
  {
    id: "cursor",
    name: "Cursor",
    description: "Track time for clients while you code",
    href: "/mcp/cursor",
  },
  {
    id: "claude",
    name: "Claude",
    description: "Analyze trends and get insights",
    href: "/mcp/claude",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    description: "AI search with your real data",
    href: "/mcp/perplexity",
  },
  {
    id: "raycast",
    name: "Raycast",
    description: "Quick answers, one shortcut away",
    href: "/mcp/raycast",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    description: "Build custom integrations",
    href: "/mcp/chatgpt",
  },
  {
    id: "gemini",
    name: "Gemini",
    description: "Financial data from your terminal",
    href: "/mcp/gemini",
  },
  {
    id: "windsurf",
    name: "Windsurf",
    description: "Financial data in your AI IDE",
    href: "/mcp/windsurf",
  },
  {
    id: "cline",
    name: "Cline",
    description: "Financial data in VS Code",
    href: "/mcp/cline",
  },
  {
    id: "zed",
    name: "Zed",
    description: "Financial data in the fastest editor",
    href: "/mcp/zed",
  },
  {
    id: "opencode",
    name: "OpenCode",
    description: "Track time for clients from your terminal",
    href: "/mcp/opencode",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Automate workflows with 7,000+ apps",
    href: "/mcp/zapier",
  },
  {
    id: "copilot",
    name: "Microsoft Copilot",
    description: "Query data from Microsoft 365",
    href: "/mcp/copilot",
  },
  {
    id: "n8n",
    name: "n8n",
    description: "Automate workflows with AI agents",
    href: "/mcp/n8n",
  },
  {
    id: "make",
    name: "Make",
    description: "Visual automations with 1,500+ apps",
    href: "/mcp/make",
  },
  {
    id: "manus",
    name: "Manus",
    description: "Automate workflows with AI agents",
    href: "/mcp/manus",
  },
]

export const mcpSampleQuestions = [
  "How much runway do we have?",
  "Which invoices are overdue?",
  "What did we spend on software?",
  "Create an invoice for Acme Corp",
  "Export January transactions to my accountant",
  "What's my burn rate?",
  "Push last month's expenses to QuickBooks",
  "Show me expense breakdown",
  "Start a timer on Project X",
  "How is my revenue trending?",
  "Send a reminder for overdue invoices",
  "What's my profit margin?",
  "Log 3 hours for the client meeting",
  "Download all Q1 transactions as CSV",
  "Give me a balance sheet as of today",
]

export const mcpCapabilities = [
  "80+ tools — transactions, invoices, time tracking, exports, reports, and more",
  "Full invoice lifecycle — create, send, remind, and mark paid from any AI client",
  "Export to accountant via email or push directly to Xero, QuickBooks, or Fortnox",
  "Granular permissions — read-only or full access, you choose",
  "Works with Cursor, Claude, Perplexity, Raycast, Zapier, n8n, Make, and more",
]
