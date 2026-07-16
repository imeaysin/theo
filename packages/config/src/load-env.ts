import { existsSync } from "node:fs"
import { join } from "node:path"
import { config } from "dotenv"
import { findWorkspaceRoot } from "./utils/workspace-root"

/** Loads the workspace root `.env` into `process.env` (does not override existing vars). */
export function loadRootEnvFile() {
  const root = findWorkspaceRoot(__dirname)
  const envPath = join(root, ".env")

  if (existsSync(envPath)) {
    config({ path: envPath, quiet: true })
  }
}
