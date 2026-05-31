import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig, mergeConfig } from "vitest/config"
import node from "@workspace/vitest-config/node"

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default mergeConfig(
  node,
  defineConfig({
    resolve: {
      alias: {
        "@src": path.join(rootDir, "src"),
      },
    },
  })
)
