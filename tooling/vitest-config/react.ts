import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

/** Vitest config for Vite React apps and Next.js component tests. */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    passWithNoTests: true,
  },
})
