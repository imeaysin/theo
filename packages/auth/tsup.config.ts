import { defineConfig, type Format, type Options } from "tsup"

const external = [
  "better-auth",
  "@better-auth/passkey",
  "@nestjs/common",
  "@nestjs/core",
  "@tanstack/react-query",
  "@workspace/config",
  "@workspace/contracts",
  "@workspace/email",
  "expo-secure-store",
  "hono",
  "jose",
  "mongodb",
  "next/headers",
  "react",
]

const format: Format[] = ["esm", "cjs"]

const shared = {
  format,
  splitting: false,
  sourcemap: true,
  minify: false,
  treeshake: true,
  external,
}

export default defineConfig((options): Options | Options[] => [
  {
    ...shared,
    entry: {
      auth: "src/lib/auth.ts",
      "adapters/nextjs/server": "src/adapters/nextjs/server.ts",
    },
    dts: false,
    clean: !options.watch,
    onSuccess:
      "cp src/lib/auth.d.ts dist/auth.d.ts && cp src/lib/auth.d.ts dist/auth.d.cts && cp src/adapters/nextjs/server.d.ts dist/adapters/nextjs/server.d.ts && cp src/adapters/nextjs/server.d.ts dist/adapters/nextjs/server.d.cts",
  },
  {
    ...shared,
    entry: {
      "auth-client": "src/lib/auth-client.ts",
      "permissions/platform": "src/permissions/platform.ts",
      "permissions/organization": "src/permissions/organization.ts",
      "types/auth": "src/types/auth.ts",
      "types/organization": "src/types/organization.ts",
      "adapters/nextjs/index": "src/adapters/nextjs/index.ts",
      "adapters/nestjs/index": "src/adapters/nestjs/index.ts",
      "adapters/mobile/expo-client": "src/adapters/mobile/expo-client.ts",
      "adapters/hono/bearer.middleware":
        "src/adapters/hono/bearer.middleware.ts",
      "react/index": "src/react/index.ts",
    },
    dts: true,
    clean: false,
  },
])
