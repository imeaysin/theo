import { createAuthClient } from "better-auth/react"
import { expoClient } from "@better-auth/expo/client"
import { authClientPlugins } from "./plugins/client"

interface ExpoAuthClientOptions {
  /** The app's URL scheme (must match the "scheme" in app.json) */
  scheme: string
  /** SecureStore module from expo-secure-store */
  storage: any
  /** Optional prefix for stored keys (defaults to scheme value) */
  storagePrefix?: string
}

export function createExpoAuthClient(
  source: Record<string, string | undefined>,
  options: ExpoAuthClientOptions
) {
  // Try EXPO_PUBLIC_API_URL or EXPO_PUBLIC_BETTER_AUTH_URL first, fallback to apiUrl
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
  })
}
