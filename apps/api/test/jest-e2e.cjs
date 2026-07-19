process.env.SKIP_ENV_VALIDATION ??= "true"

/** @type {import("jest").Config} */
module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testEnvironment: "node",
  testTimeout: 60000,
  testMatch: ["<rootDir>/e2e/**/*.e2e-spec.ts"],
  setupFilesAfterEnv: ["<rootDir>/e2e/jest-e2e.setup.ts"],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  moduleNameMapper: {
    "^expo-server-sdk$": "<rootDir>/mocks/expo-server-sdk.ts",
    "^@/(.*)$": "<rootDir>/../src/$1",
    "^@workspace/auth/nestjs$": "<rootDir>/mocks/workspace-auth-nestjs.ts",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@nestjs|rxjs|uuid|@workspace)/)",
  ],
}
