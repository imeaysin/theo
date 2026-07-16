import { parseWebEnv } from "@workspace/config/client"

const viteEnv = import.meta.env

export const env = parseWebEnv({
  VITE_API_URL: viteEnv.VITE_API_URL,
  VITE_AUTH_URL: viteEnv.VITE_AUTH_URL,
  VITE_APP_NAME: viteEnv.VITE_APP_NAME,
  VITE_MARKETING_URL: viteEnv.VITE_MARKETING_URL,
  VITE_SENTRY_DSN: viteEnv.VITE_SENTRY_DSN,
})
