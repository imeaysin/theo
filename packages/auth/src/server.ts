import { betterAuth } from "better-auth"
import { toNodeHandler } from "better-auth/node"
import { admin as adminPlugin } from "better-auth/plugins/admin"
import { twoFactor } from "better-auth/plugins/two-factor"
import { organization } from "better-auth/plugins/organization"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { MongoClient } from "mongodb"
import { env } from "@repo/config"
import { sendVerificationEmail, sendResetPasswordEmail } from "@repo/email"
import type { IncomingHttpHeaders } from "http"
import { ac, admin, user } from "./permissions"

const client = new MongoClient(env.MONGODB_URI)
const db = client.db()

interface SocialProviderConfig {
  clientId: string
  clientSecret: string
}

interface SocialProviders {
  google?: SocialProviderConfig
  github?: SocialProviderConfig
}

function buildSocialProviders(): SocialProviders {
  const providers: SocialProviders = {}

  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    providers.google = {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }
  }

  if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
    providers.github = {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }
  }

  return providers
}

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  basePath: "/api/auth",
  trustedOrigins: [env.WEB_URL],

  database: mongodbAdapter(db, {
    client,
    usePlural: true,
  }),

  advanced: {
    cookiePrefix: "codebase-x",
    crossSubDomainCookies: {
      enabled: false,
    },
    useSecureCookies: env.NODE_ENV === "production",
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: env.NODE_ENV !== "test",
    minPasswordLength: 8,
    maxPasswordLength: 128,
    sendResetPassword: async ({ user: resetUser, url }) => {
      await sendResetPasswordEmail(resetUser.email, url)
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user: verifyUser, url }) => {
      await sendVerificationEmail(verifyUser.email, url)
    },
  },

  socialProviders: buildSocialProviders(),

  rateLimit: {
    enabled: true,
    window: 60,
    max: 30,
  },

  plugins: [
    adminPlugin({ ac, roles: { admin, user } }),
    twoFactor(),
    organization(),
  ],
})

export { toNodeHandler }

export type AuthInstance = typeof auth

export async function getSessionFromHeaders(
  nodeHeaders: IncomingHttpHeaders
): Promise<typeof auth.$Infer.Session | null> {
  const headers = new Headers()
  for (const [key, val] of Object.entries(nodeHeaders)) {
    if (val) headers.set(key, Array.isArray(val) ? (val[0] ?? "") : val)
  }
  return auth.api.getSession({ headers })
}
