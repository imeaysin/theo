import { config } from "@workspace/eslint-config/react-internal"

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    rules: {
      "max-params": ["error", 2],
      "no-nested-ternary": "error",
    },
  },
]
