import { env } from "@/config/env"

export const site = {
  name: env.appName,
  description: "Theo web application",
  links: {
    roadmap: "https://cal.com/roadmap",
    terms: `${env.marketingUrl}/terms`,
    privacy: `${env.marketingUrl}/policy`,
  },
} as const
