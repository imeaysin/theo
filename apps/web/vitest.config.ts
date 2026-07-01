import path from "node:path"
import { fileURLToPath } from "node:url"
import react from "@workspace/vitest-config/react"
import { mergeConfig } from "vitest/config"

const root = path.dirname(fileURLToPath(import.meta.url))

export default mergeConfig(react, {
  test: {
    setupFiles: ["./test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(root, "./src"),
    },
  },
})
