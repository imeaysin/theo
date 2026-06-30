const defaultClientUrl = "http://localhost:5173"

export const site = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? process.env.APP_NAME ?? "Theo",
  description:
    "Full-stack monorepo template with auth, API, web app, and mobile.",
  clientUrl: process.env.CLIENT_URL ?? defaultClientUrl,
} as const
