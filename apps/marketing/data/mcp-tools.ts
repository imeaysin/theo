export const mcpTools: Record<string, { title: string; description: string }> = {
  claude: {
    title: "Claude + Theo",
    description:
      "Connect Theo to Claude via MCP so your assistant can answer questions about invoices, transactions, and runway.",
  },
  chatgpt: {
    title: "ChatGPT + Theo",
    description:
      "Use ChatGPT with Theo data through Model Context Protocol for financial questions in natural language.",
  },
  perplexity: {
    title: "Perplexity + Theo",
    description:
      "Query your business data from Perplexity with a secure MCP connection to Theo.",
  },
  raycast: {
    title: "Raycast + Theo",
    description:
      "Access Theo from Raycast — check balances, invoices, and recent activity without leaving your launcher.",
  },
  cursor: {
    title: "Cursor + Theo",
    description:
      "Give Cursor context from your Theo workspace when building automations and internal tools.",
  },
  manus: {
    title: "Manus + Theo",
    description:
      "Connect Manus agents to Theo for automated financial workflows and reporting.",
  },
}

export const mcpToolSlugs = Object.keys(mcpTools)
