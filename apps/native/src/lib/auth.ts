import "expo-sqlite/localStorage/install"
import {
  createExpoAuthClient,
  createSecureStoreTokenStorage,
} from "@workspace/auth/expo-client"
import { createSyncSecureStore } from "@/lib/secure-storage"

const TOKEN_KEYS = ["theo.auth.bearer", "theo.auth.access"] as const

const secureStore = createSyncSecureStore(TOKEN_KEYS)

const expoStorage = {
  getItem: (key: string) => localStorage.getItem(key),
  setItem: (key: string, value: string) => {
    localStorage.setItem(key, value)
  },
}

const tokenStorage = createSecureStoreTokenStorage(secureStore)

export const authClient = createExpoAuthClient(
  {
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  },
  {
    scheme: "acme",
    storage: expoStorage,
    tokenStorage,
    storagePrefix: "acme",
  }
)

export { tokenStorage, secureStore }
