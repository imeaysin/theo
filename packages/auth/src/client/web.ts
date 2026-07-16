import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"
import { adminClient } from "better-auth/client/plugins"
import { twoFactorClient } from "better-auth/client/plugins"
import { apiKeyClient } from "@better-auth/api-key/client"
import {
  getClientPublicEnvSource,
  parseClientPublicEnv,
} from "@workspace/config/client"
import {
  ac,
  adminRole,
  memberRole,
  ownerRole,
  viewerRole,
  WEB_TWO_FACTOR_PATH,
} from "../access"

const clientEnv = parseClientPublicEnv(getClientPublicEnvSource())

export const authClient = createAuthClient({
  baseURL: clientEnv.authUrl,
  plugins: [
    organizationClient({
      ac,
      roles: {
        owner: ownerRole,
        admin: adminRole,
        member: memberRole,
        viewer: viewerRole,
      },
      dynamicAccessControl: { enabled: true },
    }),
    adminClient({
      ac,
      roles: {
        admin: adminRole,
        user: memberRole,
      },
    }),
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.assign(WEB_TWO_FACTOR_PATH)
      },
    }),
    apiKeyClient(),
  ],
})

export const { useSession, signIn, signOut, signUp } = authClient
