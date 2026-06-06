import { defineConfig } from "tsup"

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: !options.watch,
  splitting: false,
  sourcemap: true,
  minify: false,
  external: ["react", "@workspace/config"],
}))
