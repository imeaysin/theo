import type {
  EmailProvider,
  OrganizationInvitationEmailInput,
  SendLinkEmailInput,
  SendOtpEmailInput,
} from "../types"

type DevEmailPayload = {
  to: string
  subject: string
  lines: string[]
}

export class MockEmailAdapter implements EmailProvider {
  private log(payload: DevEmailPayload) {
    const body = payload.lines.join("\n")
    console.info(
      `[email:dev] To: ${payload.to}\nSubject: ${payload.subject}\n${body}\n---`
    )
  }

  async sendVerificationEmail(input: SendLinkEmailInput): Promise<void> {
    this.log({
      to: input.to,
      subject: "Verify your email",
      lines: [`Verification link: ${input.url}`],
    })
  }

  async sendResetPasswordEmail(input: SendLinkEmailInput): Promise<void> {
    this.log({
      to: input.to,
      subject: "Reset your password",
      lines: [`Reset link: ${input.url}`],
    })
  }

  async sendMagicLinkEmail(input: SendLinkEmailInput): Promise<void> {
    this.log({
      to: input.to,
      subject: "Your sign-in link",
      lines: [`Magic link: ${input.url}`],
    })
  }

  async sendOtpEmail(input: SendOtpEmailInput): Promise<void> {
    const subject =
      input.type === "sign-in" ? "Your sign-in code" : "Verify your email"
    this.log({
      to: input.to,
      subject,
      lines: [`OTP (${input.type}): ${input.otp}`],
    })
  }

  async sendOrganizationInvitationEmail(
    input: OrganizationInvitationEmailInput
  ): Promise<void> {
    this.log({
      to: input.to,
      subject: `Join ${input.organizationName}`,
      lines: [
        `Inviter: ${input.inviterName}`,
        `Accept: ${input.url}`,
        input.role ? `Role: ${input.role}` : "",
      ].filter(Boolean),
    })
  }
}
