import { createAuthClient } from "better-auth/client"
import {
  jwtClient,
  adminClient,
  twoFactorClient,
  organizationClient,
} from "better-auth/client/plugins"
import * as SecureStore from "expo-secure-store"
import { parseClientPublicEnv } from "@workspace/config/client"
import { adminPluginOptions } from "../../config/admin-plugin"
import { organizationPluginOptions } from "../../config/organization-plugin"

const TOKEN_KEY = "__ba_token"

const { authUrl } = parseClientPublicEnv({
  EXPO_PUBLIC_AUTH_URL: process.env.EXPO_PUBLIC_AUTH_URL,
})

export const mobileAuthClient = createAuthClient({
  baseURL: authUrl,
  plugins: [
    jwtClient(),
    adminClient(adminPluginOptions),
    twoFactorClient(),
    organizationClient(organizationPluginOptions),
  ],
  fetchOptions: {
    onSuccess: async (ctx) => {
      const token = ctx.response.headers.get("set-auth-token")
      if (token) await SecureStore.setItemAsync(TOKEN_KEY, token)
    },
    auth: {
      type: "Bearer",
      token: async () => (await SecureStore.getItemAsync(TOKEN_KEY)) ?? "",
    },
  },
})
