import { createEnv } from "../validate"
import {
  realtimeEnvSchema,
  pickServerDefaults,
  type RealtimeEnv,
} from "../schemas/server"

/** Event bus config — used by `@workspace/realtime`. */
export const realtimeEnv = createEnv(
  realtimeEnvSchema,
  pickServerDefaults(["REALTIME_PROVIDER", "REDIS_URL"])
)

export type { RealtimeEnv }
