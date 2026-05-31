import { defineConfig } from "vitest/config"

/**
 * Default Vitest config for Node packages and Nest-style apps.
 * Use `test/` or colocated `*.test.ts` under `src/`.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.ts", "src/**/*.test.ts"],
    passWithNoTests: true,
  },
})
