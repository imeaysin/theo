import { defineConfig } from "tsup"

/** Only bundle Node/server code. React & vanilla clients are consumed as source by Vite/apps. */
export default defineConfig((options) => ({
  entry: ["src/index.ts", "src/server.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: !options.watch,
  splitting: false,
  sourcemap: true,
  minify: false,
  external: [
    "mongodb",
    "@workspace/permission-manager",
    "@workspace/config",
    "@workspace/db",
    "@workspace/email",
    "better-auth",
  ],
}))
