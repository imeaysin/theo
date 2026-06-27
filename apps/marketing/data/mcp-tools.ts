import { mcpClients } from "@/data/mcp-clients"

export const mcpTools = Object.fromEntries(
  mcpClients.map((client) => [
    client.id,
    {
      title: `${client.name} + Theo`,
      description: client.description,
    },
  ])
)

export const mcpToolSlugs = mcpClients.map((client) => client.id)
