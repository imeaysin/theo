import { betterAuth } from "better-auth"
import { toNodeHandler } from "better-auth/node"
import { admin } from "better-auth/plugins/admin"
import { openAPI } from "better-auth/plugins"
import { expo } from "@better-auth/expo"

import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { MongoClient } from "mongodb"
import { env } from "@workspace/config"
import { sendVerificationEmail, sendResetPasswordEmail } from "@workspace/email"
import type { IncomingHttpHeaders } from "http"
import { ac, admin as adminRole, user } from "./authorization"
import { nodeHeadersToWebHeaders } from "@workspace/utils"
import { autoAdminHook } from "./bootstrap-admin"

const client = new MongoClient(env.MONGODB_URI)
const db = client.db()

interface SocialProviderConfig {
  clientId: string
  clientSecret: string
}

interface SocialProviders {
  google?: SocialProviderConfig
}

function buildSocialProviders(): SocialProviders {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    return {}
  }

  return {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  }
}

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  basePath: "/api/auth",
  trustedOrigins: env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).concat(["acme://"]),

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },

  database: mongodbAdapter(db, {
    client,
    usePlural: true,
  }),

  advanced: {
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip"],
      getIpAddress: (headers: Headers) => {
        const forwarded = headers.get("x-forwarded-for")
        if (forwarded) return forwarded.split(",")[0]?.trim()

        const realIp = headers.get("x-real-ip")
        if (realIp) return realIp

        return "127.0.0.1"
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: env.NODE_ENV === "production",
    minPasswordLength: 8,
    maxPasswordLength: 128,
    sendResetPassword: async ({ user: resetUser, url }) => {
      await sendResetPasswordEmail(resetUser.email, url)
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user: verifyUser, url }) => {
      await sendVerificationEmail(verifyUser.email, url)
    },
  },

  socialProviders: buildSocialProviders(),

  rateLimit: {
    enabled: env.NODE_ENV === "production",
    window: 60,
    max: 30,
  },

  hooks: {
    after: autoAdminHook,
  },

  plugins: [
    admin({ ac, roles: { admin: adminRole, user }, defaultRole: "user" }),
    openAPI(),
    expo(),
  ],
})

export { toNodeHandler }

/** Express/Nest route handler for `/api/auth/*` (see create-auth-skill). */
export const authHandler = toNodeHandler(auth)

export type AuthInstance = typeof auth

export type Session = typeof auth.$Infer.Session
export type SessionUser = Session["user"]
export type SessionData = Session["session"]

export async function getSessionFromHeaders(
  nodeHeaders: IncomingHttpHeaders
): Promise<typeof auth.$Infer.Session | null> {
  return auth.api.getSession({ headers: nodeHeadersToWebHeaders(nodeHeaders) })
}
