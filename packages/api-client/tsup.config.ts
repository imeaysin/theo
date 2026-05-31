import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "tsup"

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  entry: ["src/index.ts"],
  tsconfig: "tsconfig.build.json",
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  esbuildOptions(options) {
    options.alias = {
      "@src": path.join(rootDir, "src"),
    }
  },
})
