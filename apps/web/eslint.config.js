import { config as reactInternalConfig } from "@workspace/eslint-config/react-internal"
import reactRefresh from "eslint-plugin-react-refresh"

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...reactInternalConfig,
  {
    plugins: {
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
]
