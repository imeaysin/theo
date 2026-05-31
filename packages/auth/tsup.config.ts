import { defineConfig } from "tsup"

export default defineConfig((options) => ({
  entry: [
    "src/index.ts",
    "src/client.ts",
    "src/server.ts",
    "src/permissions.ts",
    "src/session.ts",
  ],
  format: ["esm", "cjs"],
  dts: true,
  clean: !options.watch,
  splitting: false,
  sourcemap: true,
  minify: false,
  external: ["mongodb", "@repo/config", "@repo/db", "@repo/email"],
}))
