import { z } from "zod"
import {
  DEFAULT_APP_NAME,
  DEFAULT_PORT,
  DEV_ALLOWED_ORIGINS,
  DEV_URLS,
} from "../constants"

const sharedSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  APP_NAME: z.string().min(1).default(DEFAULT_APP_NAME),
  PORT: z.coerce.number().int().positive().default(DEFAULT_PORT),
})

const databaseSchema = z.object({
  MONGODB_URI: z.string().min(1),
})

const urlsSchema = z.object({
  BETTER_AUTH_URL: z.string().url(),
  CLIENT_URL: z.string().url(),
  MARKETING_URL: z.string().url(),
  ALLOWED_ORIGINS: z.string().min(1),
})

const authSchema = z.object({
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
  ADMIN_USER_IDS: z.string().default(""),
})

const emailSchema = z.object({
  EMAIL_PROVIDER: z.enum(["resend", "mock"]).default("mock"),
  RESEND_API_KEY: z.string().default(""),
  EMAIL_FROM: z.string().min(1).optional(),
})

const storageSchema = z.object({
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

const jobsSchema = z.object({
  JOBS_PROVIDER: z.enum(["inline", "redis"]).default("inline"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  JOBS_QUEUE_NAME: z.string().min(1).default("theo"),
})

const pushSchema = z.object({
  PUSH_PROVIDER: z.enum(["expo", "console"]).default("console"),
  EXPO_ACCESS_TOKEN: z.string().default(""),
})

const realtimeSchema = z.object({
  REALTIME_PROVIDER: z.enum(["memory", "redis"]).default("memory"),
})

const cacheSchema = z.object({
  CACHE_PROVIDER: z.enum(["memory", "redis"]).default("memory"),
})

const rateLimitSchema = z.object({
  RATE_LIMIT_ENABLED: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
})

const paymentSchema = z.object({
  PAYMENT_PROVIDER: z.enum(["bkash", "sslcommerz"]).default("bkash"),
  PAYMENT_IS_SANDBOX: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
  BKASH_APP_KEY: z.string().default(""),
  BKASH_APP_SECRET: z.string().default(""),
  BKASH_USERNAME: z.string().default(""),
  BKASH_PASSWORD: z.string().default(""),
  SSLCOMMERZ_STORE_ID: z.string().default(""),
  SSLCOMMERZ_STORE_PASSWORD: z.string().default(""),
})

export const serverSchema = sharedSchema
  .extend(databaseSchema.shape)
  .extend(urlsSchema.shape)
  .extend(authSchema.shape)
  .extend(emailSchema.shape)
  .extend(storageSchema.shape)
  .extend(jobsSchema.shape)
  .extend(pushSchema.shape)
  .extend(realtimeSchema.shape)
  .extend(cacheSchema.shape)
  .extend(rateLimitSchema.shape)
  .extend(paymentSchema.shape)

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
  EMAIL_PROVIDER: "mock",
  RESEND_API_KEY: "",
  GOOGLE_CLIENT_ID: "",
  GOOGLE_CLIENT_SECRET: "",
  GITHUB_CLIENT_ID: "",
  GITHUB_CLIENT_SECRET: "",
  APPLE_CLIENT_ID: "",
  APPLE_TEAM_ID: "",
  APPLE_KEY_ID: "",
  APPLE_PRIVATE_KEY: "",
  MICROSOFT_CLIENT_ID: "",
  MICROSOFT_CLIENT_SECRET: "",
  DISCORD_CLIENT_ID: "",
  DISCORD_CLIENT_SECRET: "",
  ADMIN_USER_IDS: "",
  STORAGE_PROVIDER: "local",
  STORAGE_LOCAL_PATH: "./uploads",
  STORAGE_LOCAL_URL: `${DEV_URLS.API}/uploads`,
  STORAGE_S3_BUCKET: "",
  STORAGE_S3_REGION: "",
  STORAGE_S3_ENDPOINT: "",
  STORAGE_S3_ACCESS_KEY_ID: "",
  STORAGE_S3_SECRET_ACCESS_KEY: "",
  STORAGE_S3_BASE_URL: "",
  JOBS_PROVIDER: "inline",
  REDIS_URL: "redis://localhost:6379",
  JOBS_QUEUE_NAME: "theo",
  PUSH_PROVIDER: "console",
  EXPO_ACCESS_TOKEN: "",
  REALTIME_PROVIDER: "memory",
  CACHE_PROVIDER: "memory",
  PAYMENT_PROVIDER: "bkash",
  BKASH_APP_KEY: "",
  BKASH_APP_SECRET: "",
  BKASH_USERNAME: "",
  BKASH_PASSWORD: "",
  SSLCOMMERZ_STORE_ID: "",
  SSLCOMMERZ_STORE_PASSWORD: "",
} as const satisfies z.input<typeof serverSchema>

/** Subset schemas — derived from the full server schema so keys stay in sync. */
export const databaseEnvSchema = serverSchema.pick({ MONGODB_URI: true })

export const emailEnvSchema = serverSchema.pick({
  EMAIL_PROVIDER: true,
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

export const jobsEnvSchema = serverSchema.pick({
  JOBS_PROVIDER: true,
  REDIS_URL: true,
  JOBS_QUEUE_NAME: true,
})

export const pushEnvSchema = serverSchema.pick({
  PUSH_PROVIDER: true,
  EXPO_ACCESS_TOKEN: true,
})

export const realtimeEnvSchema = serverSchema.pick({
  REALTIME_PROVIDER: true,
  REDIS_URL: true,
})

export const cacheEnvSchema = serverSchema.pick({
  CACHE_PROVIDER: true,
  REDIS_URL: true,
})

export const paymentEnvSchema = serverSchema.pick({
  PAYMENT_PROVIDER: true,
  PAYMENT_IS_SANDBOX: true,
  BKASH_APP_KEY: true,
  BKASH_APP_SECRET: true,
  BKASH_USERNAME: true,
  BKASH_PASSWORD: true,
  SSLCOMMERZ_STORE_ID: true,
  SSLCOMMERZ_STORE_PASSWORD: true,
})

export type ServerEnv = z.infer<typeof serverSchema>
export type DatabaseEnv = z.infer<typeof databaseEnvSchema>
export type EmailEnv = z.infer<typeof emailEnvSchema>
export type StorageEnv = z.infer<typeof storageEnvSchema>
export type JobsEnv = z.infer<typeof jobsEnvSchema>
export type PushEnv = z.infer<typeof pushEnvSchema>
export type RealtimeEnv = z.infer<typeof realtimeEnvSchema>
export type CacheEnv = z.infer<typeof cacheEnvSchema>
export type PaymentEnv = z.infer<typeof paymentEnvSchema>

export function pickServerDefaults<const K extends keyof typeof serverDefaults>(
  keys: readonly K[]
): Pick<typeof serverDefaults, K> {
  return Object.fromEntries(
    keys.map((key) => [key, serverDefaults[key]])
  ) as Pick<typeof serverDefaults, K>
}
