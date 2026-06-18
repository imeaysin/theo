import { defineConfig } from "tsup"

/** Bundle server-side auth code. Client sources are consumed directly by Vite/Expo. */
export default defineConfig((options) => ({
  entry: {
    index: "src/index.ts",
    "server/index": "src/server/index.ts",
    "access-control/index": "src/access-control/index.ts",
    "testing/index": "src/testing/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: !options.watch,
  splitting: false,
  sourcemap: true,
  minify: false,
  external: [
    "mongodb",
    "@workspace/config",
    "@workspace/email",
    "@workspace/utils",
    "better-auth",
    "@better-auth/expo",
    "jose",
  ],
}))
