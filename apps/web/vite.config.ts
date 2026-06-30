import path from "node:path"
import { fileURLToPath } from "node:url"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.join(rootDir, "src"),
    },
  },
  server: {
    fs: {
      allow: [path.join(rootDir, "../..")],
    },
  },
  envDir: path.join(rootDir, "../.."),
})
