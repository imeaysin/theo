import { defineConfig } from "tsup"

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: !options.watch,
  splitting: true,
  sourcemap: true,
  minify: false,
  treeshake: true,
  external: ["ioredis"],
}))
