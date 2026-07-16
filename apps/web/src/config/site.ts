import { env } from "@/config/env"

export const site = {
  name: env.appName,
  description: "Web application",
  links: {
    terms: `${env.marketingUrl}/terms`,
    privacy: `${env.marketingUrl}/policy`,
  },
} as const
