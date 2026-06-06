import { parseClientPublicEnv } from "@workspace/config/client"

export const env = parseClientPublicEnv(import.meta.env)
