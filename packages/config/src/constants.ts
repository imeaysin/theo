/** Shared dev defaults — single source for server env, client parsers, and app config. */
export const DEFAULT_APP_NAME = "Theo" as const

export const DEFAULT_PORT = 4000 as const

export const DEV_URLS = {
  API: "http://localhost:4000",
  WEB: "http://localhost:5173",
  MARKETING: "http://localhost:3000",
  MOBILE: "http://localhost:8081",
} as const

export const DEV_ALLOWED_ORIGINS =
  `${DEV_URLS.MARKETING},${DEV_URLS.WEB},${DEV_URLS.MOBILE},http://127.0.0.1:3000,http://127.0.0.1:5173,http://127.0.0.1:8081` as const

export const clientDefaults = {
  apiUrl: DEV_URLS.API,
  authUrl: DEV_URLS.API,
  appName: DEFAULT_APP_NAME,
  marketingUrl: DEV_URLS.MARKETING,
  clientUrl: DEV_URLS.WEB,
} as const
