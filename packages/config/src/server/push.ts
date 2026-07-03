import { createEnv } from "../validate"
import {
  pushEnvSchema,
  pickServerDefaults,
  type PushEnv,
} from "../schemas/server"

/** Push notification config — used by `@workspace/notifications`. */
export const pushEnv = createEnv(
  pushEnvSchema,
  pickServerDefaults(["PUSH_PROVIDER", "EXPO_ACCESS_TOKEN"])
)

export type { PushEnv }
