import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { admin } from "better-auth/plugins/admin"
import { bearer } from "better-auth/plugins/bearer"
import { jwt } from "better-auth/plugins/jwt"
import { twoFactor } from "better-auth/plugins/two-factor"
import { magicLink } from "better-auth/plugins/magic-link"
import { emailOTP } from "better-auth/plugins/email-otp"
import { organization } from "better-auth/plugins/organization"
import { passkey } from "@better-auth/passkey"
import { nextCookies } from "better-auth/next-js"
import { env } from "@workspace/config"
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendMagicLinkEmail,
  sendOtpEmail,
  sendOrganizationInvitationEmail,
} from "@workspace/email"
import { adminPluginOptions } from "../config/admin-plugin"
import { organizationPluginOptions } from "../config/organization-plugin"
import type { JwtPayload } from "../config/jwt"
import { authDb, authMongoClient } from "../db/mongo"
import { findOrganizationMemberRole } from "./organization-role"
import {
  ensureDefaultOrganization,
  ensureSessionActiveOrganization,
} from "./default-organization"

function socialProviders() {
  const providers: Record<string, Record<string, string>> = {}

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
  if (
    env.APPLE_CLIENT_ID &&
    env.APPLE_TEAM_ID &&
    env.APPLE_KEY_ID &&
    env.APPLE_PRIVATE_KEY
  ) {
    providers.apple = {
      clientId: env.APPLE_CLIENT_ID,
      teamId: env.APPLE_TEAM_ID,
      keyId: env.APPLE_KEY_ID,
      privateKey: env.APPLE_PRIVATE_KEY,
    }
  }
  if (env.MICROSOFT_CLIENT_ID && env.MICROSOFT_CLIENT_SECRET) {
    providers.microsoft = {
      clientId: env.MICROSOFT_CLIENT_ID,
      clientSecret: env.MICROSOFT_CLIENT_SECRET,
    }
  }
  if (env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET) {
    providers.discord = {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }
  }

  return providers
}

export function createAuth() {
  const auth = betterAuth({
    appName: env.APP_NAME,
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: env.ALLOWED_ORIGINS.split(",").map((origin) =>
      origin.trim()
    ),

    database: mongodbAdapter(authDb, { client: authMongoClient }),

    databaseHooks: {
      user: {
        create: {
          after: async (user, context) => {
            await ensureDefaultOrganization(context, {
              id: user.id,
              name: user.name,
            })
          },
        },
      },
      session: {
        create: {
          before: async (session, context) =>
            ensureSessionActiveOrganization(context, session),
        },
      },
    },

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }) => {
        await sendResetPasswordEmail(user.email, url)
      },
    },

    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        await sendVerificationEmail(user.email, url)
      },
      autoSignInAfterVerification: true,
    },

    socialProviders: socialProviders(),

    plugins: [
      jwt({
        jwks: {
          keyPairConfig: { alg: "ES256" },
          rotationInterval: 60 * 60 * 24 * 30,
          gracePeriod: 60 * 60 * 24 * 30,
        },
        jwt: {
          expirationTime: env.AUTH_JWT_EXPIRATION,
          definePayload: async ({ user, session }) => {
            const activeOrganizationId = session.activeOrganizationId ?? null
            const organizationRole = activeOrganizationId
              ? await findOrganizationMemberRole(activeOrganizationId, user.id)
              : null

            return {
              id: user.id,
              email: user.email,
              role: user.role,
              name: user.name,
              activeOrganizationId,
              organizationRole,
            } satisfies JwtPayload
          },
        },
      }),

      bearer(),

      admin({
        ...adminPluginOptions,
        defaultRole: "user",
      }),

      twoFactor({ issuer: env.AUTH_TOTP_ISSUER }),

      passkey({
        rpID: new URL(env.BETTER_AUTH_URL).hostname,
        rpName: env.APP_NAME,
        origin: env.BETTER_AUTH_URL,
      }),

      magicLink({
        sendMagicLink: async ({ email, url }) => {
          await sendMagicLinkEmail(email, url)
        },
      }),

      emailOTP({
        sendVerificationOTP: async ({ email, otp, type }) => {
          await sendOtpEmail(email, otp, type)
        },
      }),

      organization({
        ...organizationPluginOptions,
        allowUserToCreateOrganization: true,
        organizationLimit: 10,
        membershipLimit: 100,
        invitationExpiresIn: 60 * 60 * 24 * 7,
        dynamicAccessControl: {
          ...organizationPluginOptions.dynamicAccessControl,
          maximumRolesPerOrganization: 20,
        },
        sendInvitationEmail: async (data) => {
          const url = `${env.CLIENT_URL}/accept-invitation?id=${data.id}`
          await sendOrganizationInvitationEmail(
            data.email,
            data.organization.name,
            data.inviter.user.name ?? "A team member",
            url
          )
        },
      }),

      nextCookies(),
    ],
  })

  return auth
}

export const auth = createAuth()

export type Auth = ReturnType<typeof createAuth>
