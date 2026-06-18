import { createAuthClient } from "better-auth/react"
import { expoClient } from "@better-auth/expo/client"
import { authClientPlugins, createBearerFetchOptions } from "./plugins"
import {
  createSecureStoreTokenStorage,
  type TokenStorage,
} from "./token-storage"

export { createSecureStoreTokenStorage, type TokenStorage } from "./token-storage"
export { refreshAccessToken } from "./refresh-access-token"
export { getAuthorizationHeader } from "./token-storage"

export interface ExpoAuthClientOptions {
  scheme: string
  storage: {
    setItem: (key: string, value: string) => unknown
    getItem: (key: string) => string | null
    deleteItemAsync?: (key: string) => Promise<void>
  }
  tokenStorage: TokenStorage
  storagePrefix?: string
}

export function createExpoAuthClient(
  source: Record<string, string | undefined>,
  options: ExpoAuthClientOptions
) {
  const apiUrl =
    source.EXPO_PUBLIC_API_URL ||
    source.EXPO_PUBLIC_BETTER_AUTH_URL ||
    source.apiUrl ||
    ""
  const baseURL = `${apiUrl.replace(/\/+$/, "")}/api/auth`

  return createAuthClient({
    baseURL,
    plugins: [
      ...authClientPlugins,
      expoClient({
        scheme: options.scheme,
        storagePrefix: options.storagePrefix ?? options.scheme,
        storage: options.storage,
      }),
    ],
    fetchOptions: {
      ...createBearerFetchOptions(options.tokenStorage),
      credentials: "omit",
    },
  })
}

export type ExpoAuthClient = ReturnType<typeof createExpoAuthClient>
