import { z } from "zod"
import {
  DEFAULT_APP_NAME,
  DEFAULT_PORT,
  DEV_ALLOWED_ORIGINS,
  DEV_URLS,
} from "../constants"

export const sharedSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  APP_NAME: z.string().min(1).default(DEFAULT_APP_NAME),
  PORT: z.coerce.number().int().positive().default(DEFAULT_PORT),
})

export const databaseSchema = z.object({
  MONGODB_URI: z.string().min(1),
})

export const urlsSchema = z.object({
  BETTER_AUTH_URL: z.string().url(),
  CLIENT_URL: z.string().url(),
  MARKETING_URL: z.string().url(),
  ALLOWED_ORIGINS: z.string().min(1),
})

export const authSchema = z.object({
  BETTER_AUTH_SECRET: z.string().min(32),
  AUTH_JWT_EXPIRATION: z.string().default("15m"),
  AUTH_TOTP_ISSUER: z.string().default("Theo"),
  GOOGLE_CLIENT_ID: z.string().default(""),
  GOOGLE_CLIENT_SECRET: z.string().default(""),
  GITHUB_CLIENT_ID: z.string().default(""),
  GITHUB_CLIENT_SECRET: z.string().default(""),
  APPLE_CLIENT_ID: z.string().default(""),
  APPLE_TEAM_ID: z.string().default(""),
  APPLE_KEY_ID: z.string().default(""),
  APPLE_PRIVATE_KEY: z.string().default(""),
  MICROSOFT_CLIENT_ID: z.string().default(""),
  MICROSOFT_CLIENT_SECRET: z.string().default(""),
  DISCORD_CLIENT_ID: z.string().default(""),
  DISCORD_CLIENT_SECRET: z.string().default(""),
})

export const emailSchema = z.object({
  RESEND_API_KEY: z.string().default(""),
  EMAIL_FROM: z.string().min(1).optional(),
})

export const storageSchema = z.object({
  STORAGE_PROVIDER: z.enum(["local", "s3"]).default("local"),
  STORAGE_LOCAL_PATH: z.string().default("./uploads"),
  STORAGE_LOCAL_URL: z.string().default(`${DEV_URLS.API}/uploads`),
  STORAGE_S3_BUCKET: z.string().default(""),
  STORAGE_S3_REGION: z.string().default(""),
  STORAGE_S3_ENDPOINT: z.string().default(""),
  STORAGE_S3_ACCESS_KEY_ID: z.string().default(""),
  STORAGE_S3_SECRET_ACCESS_KEY: z.string().default(""),
  STORAGE_S3_BASE_URL: z.string().default(""),
})

export const serverSchema = sharedSchema
  .merge(databaseSchema)
  .merge(urlsSchema)
  .merge(authSchema)
  .merge(emailSchema)
  .merge(storageSchema)

export const serverDefaults = {
  NODE_ENV: "development",
  APP_NAME: DEFAULT_APP_NAME,
  PORT: DEFAULT_PORT,
  MONGODB_URI: "mongodb://localhost:27017/theo",
  BETTER_AUTH_URL: DEV_URLS.API,
  CLIENT_URL: DEV_URLS.WEB,
  MARKETING_URL: DEV_URLS.MARKETING,
  ALLOWED_ORIGINS: DEV_ALLOWED_ORIGINS,
  BETTER_AUTH_SECRET:
    "j6K#v9$e8f7037b453c8a6b455a6fe9cc7e5d1438af032e3bf8731affcea1e9967481d7!z8*Nq5&W3tY7uB9xCcE1",
  AUTH_JWT_EXPIRATION: "15m",
  AUTH_TOTP_ISSUER: DEFAULT_APP_NAME,
  RESEND_API_KEY: "",
  STORAGE_PROVIDER: "local",
  STORAGE_LOCAL_PATH: "./uploads",
  STORAGE_LOCAL_URL: `${DEV_URLS.API}/uploads`,
  STORAGE_S3_BUCKET: "",
  STORAGE_S3_REGION: "",
  STORAGE_S3_ENDPOINT: "",
  STORAGE_S3_ACCESS_KEY_ID: "",
  STORAGE_S3_SECRET_ACCESS_KEY: "",
  STORAGE_S3_BASE_URL: "",
} as const satisfies z.input<typeof serverSchema>

/** Subset schemas — derived from the full server schema so keys stay in sync. */
export const databaseEnvSchema = serverSchema.pick({ MONGODB_URI: true })

export const emailEnvSchema = serverSchema.pick({
  RESEND_API_KEY: true,
  EMAIL_FROM: true,
  APP_NAME: true,
  BETTER_AUTH_URL: true,
})

export const storageEnvSchema = serverSchema.pick({
  STORAGE_PROVIDER: true,
  STORAGE_LOCAL_PATH: true,
  STORAGE_LOCAL_URL: true,
  STORAGE_S3_BUCKET: true,
  STORAGE_S3_REGION: true,
  STORAGE_S3_ENDPOINT: true,
  STORAGE_S3_ACCESS_KEY_ID: true,
  STORAGE_S3_SECRET_ACCESS_KEY: true,
  STORAGE_S3_BASE_URL: true,
})

export type ServerEnv = z.infer<typeof serverSchema>
export type DatabaseEnv = z.infer<typeof databaseEnvSchema>
export type EmailEnv = z.infer<typeof emailEnvSchema>
export type StorageEnv = z.infer<typeof storageEnvSchema>

export function pickServerDefaults<const K extends keyof typeof serverDefaults>(
  keys: readonly K[]
): Pick<typeof serverDefaults, K> {
  return Object.fromEntries(
    keys.map((key) => [key, serverDefaults[key]])
  ) as Pick<typeof serverDefaults, K>
}
