import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts", "src/http.ts"],
  format: ["cjs", "esm"],
  dts: true,
})
