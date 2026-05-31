import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import { config as baseConfig } from "./base.js";

/**
 * A custom ESLint configuration for React Native (Expo) apps.
 *
 * @type {import("eslint").Linter.Config[]} */
export const config = [
  ...baseConfig,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.node,
        __DEV__: "readonly",
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_|React",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-require-imports": [
        "error",
        {
          allow: ["^@/assets/.*"],
        },
      ],
    },
  },
  {
    ignores: [
      ".expo/**",
      "android/**",
      "ios/**",
      "metro.config.js",
      "babel.config.js",
      "scripts/**",
    ],
  },
];
