import { parseClientPublicEnv } from "@repo/config/client"

export const env = parseClientPublicEnv(import.meta.env)
