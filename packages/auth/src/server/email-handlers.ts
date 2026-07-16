import { env } from "@workspace/config"
import { getEmailProviderConfig } from "@workspace/config/email"
import { createEmailProvider } from "@workspace/email"
import { WEB_ACCEPT_INVITATION_PATH_PREFIX } from "../access"

const emailProvider = createEmailProvider(getEmailProviderConfig())

export async function sendVerificationEmail(input: {
  readonly to: string
  readonly url: string
}) {
  await emailProvider.sendVerificationEmail({
    to: input.to,
    url: input.url,
  })
}

export async function sendResetPasswordEmail(input: {
  readonly to: string
  readonly url: string
}) {
  await emailProvider.sendResetPasswordEmail({
    to: input.to,
    url: input.url,
  })
}

export async function sendOrganizationInvitationEmail(input: {
  readonly to: string
  readonly organizationName: string
  readonly inviterName: string
  readonly inviterEmail?: string
  readonly role?: string
  readonly invitationId: string
}) {
  const inviteLink = `${env.CLIENT_URL}${WEB_ACCEPT_INVITATION_PATH_PREFIX}/${input.invitationId}`
  await emailProvider.sendOrganizationInvitationEmail({
    to: input.to,
    url: inviteLink,
    organizationName: input.organizationName,
    inviterName: input.inviterName,
    inviterEmail: input.inviterEmail,
    role: input.role,
  })
}

export async function sendTwoFactorOtp(input: {
  readonly to: string
  readonly otp: string
}) {
  await emailProvider.sendOtpEmail({
    to: input.to,
    otp: input.otp,
    type: "sign-in",
  })
}
