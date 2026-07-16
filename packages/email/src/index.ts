export type {
  EmailProvider,
  EmailConfig,
  MockEmailConfig,
  ResendEmailConfig,
  SendLinkEmailInput,
  SendOtpEmailInput,
  OrganizationInvitationEmailInput,
} from "./types"
export { createEmailProvider } from "./factory"

export {
  EmailChangedEmail,
  EmailVerificationEmail,
  MagicLinkEmail,
  NewDeviceEmail,
  OrganizationInvitationEmail,
  OtpEmail,
  PasswordChangedEmail,
  ResetPasswordEmail,
} from "./templates"
