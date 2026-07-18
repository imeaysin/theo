import { createEnv } from "../validate"
import {
  jobsEnvSchema,
  pickServerDefaults,
  type JobsEnv,
} from "../schemas/server"

/** Background jobs — consumed by `apps/api/src/common/jobs` (BullMQ). */
export const jobsEnv = createEnv(
  jobsEnvSchema,
  pickServerDefaults(["JOBS_PROVIDER", "REDIS_URL", "JOBS_QUEUE_NAME"])
)

export type { JobsEnv }
