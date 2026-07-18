import { createEnv } from "../validate"
import {
  realtimeEnvSchema,
  pickServerDefaults,
  type RealtimeEnv,
} from "../schemas/server"

/** Realtime config — reserved for `apps/api/src/common/realtime` (Socket.IO). */
export const realtimeEnv = createEnv(
  realtimeEnvSchema,
  pickServerDefaults(["REALTIME_PROVIDER", "REDIS_URL"])
)

export type { RealtimeEnv }
