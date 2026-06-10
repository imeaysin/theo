import { z } from "zod"

const clientPublicEnvSchema = z.object({
  VITE_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  VITE_APP_NAME: z.string().min(1).optional(),
})

export type ClientPublicEnv = z.infer<typeof clientPublicEnvSchema>

const defaultApiUrl = "http://localhost:4000"
const defaultAppName = "Theo"

export function parseClientPublicEnv(
  source: Record<string, string | undefined>
): ClientPublicEnv & { apiUrl: string; appName: string } {
  const parsed = clientPublicEnvSchema.parse(source)
  const apiUrl =
    parsed.VITE_API_URL ?? parsed.NEXT_PUBLIC_API_URL ?? defaultApiUrl
  const appName = parsed.VITE_APP_NAME ?? defaultAppName

  return { ...parsed, apiUrl, appName }
}
