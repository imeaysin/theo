import { existsSync, readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { z } from "zod"

function findWorkspaceEnvFile(startDir: string): string | null {
  let currentDir = resolve(startDir)

  while (true) {
    const envPath = join(currentDir, ".env")
    if (existsSync(envPath)) return envPath

    const parentDir = dirname(currentDir)
    if (parentDir === currentDir) return null

    currentDir = parentDir
  }
}

function unquoteEnvValue(value: string): string {
  const trimmed = value.trim()
  const quote = trimmed[0]
  const isQuoted =
    (quote === '"' || quote === "'") && trimmed[trimmed.length - 1] === quote

  return isQuoted ? trimmed.slice(1, -1) : trimmed
}

function loadRootEnvFile() {
  const envPath =
    findWorkspaceEnvFile(process.cwd()) ?? findWorkspaceEnvFile(__dirname)
  if (!envPath) return

  const envFile = readFileSync(envPath, "utf8")
  for (const line of envFile.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    const separatorIndex = trimmed.indexOf("=")
    if (separatorIndex === -1) continue

    const key = trimmed.slice(0, separatorIndex).trim()
    if (!key || process.env[key] !== undefined) continue

    process.env[key] = unquoteEnvValue(trimmed.slice(separatorIndex + 1))
  }
}

loadRootEnvFile()

const buildDefaults = {
  MONGODB_URI: "mongodb://localhost:27017/dummy",
  BETTER_AUTH_SECRET:
    "j6K#v9$e8f7037b453c8a6b455a6fe9cc7e5d1438af032e3bf8731affcea1e9967481d7!z8*Nq5&W3tY7uB9xCcE1",
  BETTER_AUTH_URL: "http://localhost:3000",
  RESEND_API_KEY: "re_123456789",
  WEB_URL: "http://localhost:3000",
  NEXT_PUBLIC_API_URL: "http://localhost:4000",
  APP_NAME: "Theo",
  NODE_ENV: "development",
} as const

const envSchema = z.object({
  MONGODB_URI: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  RESEND_API_KEY: z.string().min(1),
  WEB_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  APP_NAME: z.string().min(1).default("Theo"),
  GOOGLE_CLIENT_ID: z.string().default(""),
  GOOGLE_CLIENT_SECRET: z.string().default(""),
  GITHUB_CLIENT_ID: z.string().default(""),
  GITHUB_CLIENT_SECRET: z.string().default(""),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
})

export type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  const isBuildPhase =
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.SKIP_ENV_VALIDATION === "true"

  const dataToValidate = isBuildPhase
    ? { ...buildDefaults, ...process.env }
    : process.env

  const result = envSchema.safeParse(dataToValidate)

  if (!result.success) {
    console.error(
      "❌ Invalid environment variables:",
      result.error.flatten().fieldErrors
    )
    throw new Error("Invalid environment variables")
  }

  return result.data
}

export const env = validateEnv()
