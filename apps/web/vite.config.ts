import path from "node:path"
import { fileURLToPath } from "node:url"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import { DEV_URLS } from "@workspace/config/client"

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const apiOrigin = DEV_URLS.API

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.join(rootDir, "src"),
    },
  },
  envDir: path.join(rootDir, "../.."),
  server: {
    fs: {
      allow: [path.join(rootDir, "../..")],
    },
    proxy: {
      "/api": {
        target: apiOrigin,
        changeOrigin: true,
      },
      "/v1": {
        target: apiOrigin,
        changeOrigin: true,
      },
      "/uploads": {
        target: apiOrigin,
        changeOrigin: true,
      },
    },
  },
})
