process.env.SKIP_ENV_VALIDATION ??= "true"

module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testEnvironment: "node",
  testMatch: ["<rootDir>/test/unit/**/*.spec.ts"],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["**/*.(t|j)s", "!**/*.spec.ts"],
  coverageDirectory: "coverage",
  setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^expo-server-sdk$": "<rootDir>/test/mocks/expo-server-sdk.ts",
    "^@workspace/auth/nestjs$": "<rootDir>/test/mocks/workspace-auth-nestjs.ts",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@nestjs|rxjs|uuid|@workspace)/)",
  ],
}
