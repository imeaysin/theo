import { config } from "@workspace/eslint-config/react-internal"

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    files: ["src/components/shell/**/*.{ts,tsx}", "src/auth/**/*.{ts,tsx}"],
    rules: {
      "max-params": ["error", 2],
      "no-nested-ternary": "error",
    },
  },
]
