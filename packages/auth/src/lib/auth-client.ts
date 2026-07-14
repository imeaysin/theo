import { createAuthClient } from "better-auth/client"
import {
  jwtClient,
  adminClient,
  twoFactorClient,
  magicLinkClient,
  emailOTPClient,
  organizationClient,
} from "better-auth/client/plugins"
import { passkeyClient } from "@better-auth/passkey/client"
import {
  getClientPublicEnvSource,
  parseClientPublicEnv,
} from "@workspace/config/client"
import { adminPluginOptions } from "../config/admin-plugin"
import { organizationPluginOptions } from "../config/organization-plugin"
import { DEFAULT_JWT_STORAGE_KEY } from "../lib/constants"

const { authUrl } = parseClientPublicEnv(getClientPublicEnvSource())

export const authClient = createAuthClient({
  baseURL: authUrl,
  plugins: [
    jwtClient(),
    adminClient(adminPluginOptions),
    twoFactorClient({ twoFactorPage: "/auth/two-factor" }),
    passkeyClient(),
    magicLinkClient(),
    emailOTPClient(),
    organizationClient(organizationPluginOptions),
  ],
  fetchOptions: {
    onSuccess: (ctx) => {
      const jwt = ctx.response.headers.get("set-auth-jwt")
      if (jwt && typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(DEFAULT_JWT_STORAGE_KEY, jwt)
      }
    },
  },
  user: {
    additionalFields: {
      bio: {
        type: "string",
        required: false,
        defaultValue: null,
      },
    } as const,
  },
})

export type AuthClient = typeof authClient
