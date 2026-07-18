import { isAbsolute, resolve } from "node:path"
import { createEnv } from "../validate"
import {
  pickServerDefaults,
  storageEnvSchema,
  type StorageEnv,
} from "../schemas/server"

import { findWorkspaceRoot } from "../utils/workspace-root"
/** File storage — used by `@workspace/storage` and `apps/api` when wired. */
export const storageEnv = createEnv(
  storageEnvSchema,
  pickServerDefaults([
    "STORAGE_PROVIDER",
    "STORAGE_LOCAL_PATH",
    "STORAGE_LOCAL_URL",
    "STORAGE_SIGNING_SECRET",
    "STORAGE_S3_BUCKET",
    "STORAGE_S3_REGION",
    "STORAGE_S3_ENDPOINT",
    "STORAGE_S3_ACCESS_KEY_ID",
    "STORAGE_S3_SECRET_ACCESS_KEY",
    "STORAGE_S3_BASE_URL",
  ])
)

/** Resolve `STORAGE_LOCAL_PATH` from the monorepo root (not `apps/api` cwd). */
export function resolveStorageLocalPath(
  path: string = storageEnv.STORAGE_LOCAL_PATH
): string {
  return isAbsolute(path) ? path : resolve(findWorkspaceRoot(), path)
}

export type { StorageEnv }
