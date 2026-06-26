import { parseMarketingEnv } from "@workspace/config/client"

const { appName, authUrl } = parseMarketingEnv(process.env)

export const marketingEnv = {
  appName,
  appUrl: process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:5173",
  authUrl,
} as const
