import * as SecureStore from "expo-secure-store"
import { createNativeAuthClient } from "@workspace/auth/mobile"

export const mobileAuthClient = createNativeAuthClient({
  storage: SecureStore,
})
