import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { admin } from "better-auth/plugins/admin"
import { organization } from "better-auth/plugins/organization"
import { twoFactor } from "better-auth/plugins/two-factor"
import { apiKey } from "@better-auth/api-key"
import { env } from "@workspace/config"
import {
  ac,
  adminRole,
  memberRole,
  ownerRole,
  viewerRole,
  MAXIMUM_ROLES_PER_ORGANIZATION,
  MAXIMUM_TEAMS_PER_ORGANIZATION,
  SESSION_EXPIRES_IN_SECONDS,
  SESSION_UPDATE_AGE_SECONDS,
} from "../access"
import { buildSocialProviders, buildTrustedOrigins } from "./auth-options"
import { getAuthDb, getAuthMongoClient } from "./db"
import {
  sendOrganizationInvitationEmail,
  sendResetPasswordEmail,
  sendTwoFactorOtp,
  sendVerificationEmail,
} from "./email-handlers"
import { createAuthSecondaryStorage } from "./secondary-storage"

export function createAuth() {
  return betterAuth({
    appName: env.APP_NAME,
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: buildTrustedOrigins(),
    database: mongodbAdapter(getAuthDb(), {
      client: getAuthMongoClient(),
    }),
    secondaryStorage: createAuthSecondaryStorage(),
    rateLimit: {
      enabled: true,
      storage: "secondary-storage",
      window: 60,
      max: 100,
      customRules: {
        "/sign-in/email": { window: 60, max: 5 },
        "/sign-up/email": { window: 60, max: 3 },
        "/two-factor/verify-totp": { window: 60, max: 5 },
        "/two-factor/verify-otp": { window: 60, max: 5 },
        "/two-factor/send-otp": { window: 60, max: 3 },
        "/request-password-reset": { window: 60, max: 3 },
        "/forget-password": { window: 60, max: 3 },
      },
    },
    session: {
      expiresIn: SESSION_EXPIRES_IN_SECONDS,
      updateAge: SESSION_UPDATE_AGE_SECONDS,
      storeSessionInDatabase: true,
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }) => {
        await sendResetPasswordEmail({ to: user.email, url })
      },
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        await sendVerificationEmail({ to: user.email, url })
      },
      sendOnSignUp: true,
    },
    user: {
      changeEmail: {
        enabled: true,
      },
      deleteUser: {
        enabled: true,
      },
    },
    socialProviders: buildSocialProviders(),
    plugins: [
      admin({
        ac,
        roles: {
          admin: adminRole,
          user: memberRole,
        },
      }),
      organization({
        ac,
        roles: {
          owner: ownerRole,
          admin: adminRole,
          member: memberRole,
          viewer: viewerRole,
        },
        dynamicAccessControl: {
          enabled: true,
          maximumRolesPerOrganization: MAXIMUM_ROLES_PER_ORGANIZATION,
        },
        allowUserToCreateOrganization: true,
        sendInvitationEmail: async (data) => {
          await sendOrganizationInvitationEmail({
            to: data.email,
            organizationName: data.organization.name,
            inviterName: data.inviter.user.name,
            inviterEmail: data.inviter.user.email,
            role: Array.isArray(data.role)
              ? data.role.join(", ")
              : String(data.role ?? "member"),
            invitationId: data.invitation.id,
          })
        },
        teams: {
          enabled: true,
          maximumTeams: MAXIMUM_TEAMS_PER_ORGANIZATION,
        },
      }),
      twoFactor({
        issuer: env.AUTH_TOTP_ISSUER,
        otpOptions: {
          sendOTP: async ({ user, otp }) => {
            await sendTwoFactorOtp({ to: user.email, otp })
          },
        },
      }),
      apiKey([
        {
          configId: "org-keys",
          defaultPrefix: "org_",
          references: "organization",
        },
      ]),
    ],
  })
}

export type Auth = ReturnType<typeof createAuth>
