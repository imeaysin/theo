import type { AppAuthClient } from "./web-client"
import type { ExpoAuthClient } from "./expo-client"

export type AuthClientWithToken = AppAuthClient | ExpoAuthClient
