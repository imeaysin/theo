import { defineConfig } from "tsup"

export default defineConfig((options) => ({
  entry: {
    index: "src/index.ts",
    "integrations/nestjs/index": "src/integrations/nestjs/index.ts",
    "integrations/react/index": "src/integrations/react/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: !options.watch,
  splitting: false,
  sourcemap: true,
  minify: false,
  external: ["@nestjs/common", "react"],
}))
