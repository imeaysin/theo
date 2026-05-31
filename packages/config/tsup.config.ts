import { defineConfig } from "tsup"

export default defineConfig((options) => ({
  entry: ["src/index.ts", "src/env.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: !options.watch,
  splitting: false,
  sourcemap: true,
  minify: false,
  treeshake: true,
}))
