import * as React from "react"
import { Resend } from "resend"
import {
  EmailVerificationEmail,
  MagicLinkEmail,
  OrganizationInvitationEmail,
  OtpEmail,
  ResetPasswordEmail,
} from "../templates"
import type {
  EmailProvider,
  OrganizationInvitationEmailInput,
  ResendEmailConfig,
  SendLinkEmailInput,
  SendOtpEmailInput,
} from "../types"

export class ResendEmailAdapter implements EmailProvider {
  private readonly client: Resend
  private readonly config: ResendEmailConfig

  constructor(config: ResendEmailConfig) {
    this.client = new Resend(config.apiKey)
    this.config = config
  }

  private get appName() {
    return this.config.appName
  }

  private async send(to: string, subject: string, react: React.ReactElement) {
    await this.client.emails.send({
      from: this.config.fromAddress,
      to,
      subject,
      react,
    })
  }

  async sendVerificationEmail(input: SendLinkEmailInput): Promise<void> {
    await this.send(
      input.to,
      "Verify your email",
      <EmailVerificationEmail
        url={input.url}
        email={input.to}
        appName={this.appName}
        expirationMinutes={input.expirationMinutes}
      />
    )
  }

  async sendResetPasswordEmail(input: SendLinkEmailInput): Promise<void> {
    await this.send(
      input.to,
      "Reset your password",
      <ResetPasswordEmail
        url={input.url}
        email={input.to}
        appName={this.appName}
        expirationMinutes={input.expirationMinutes}
      />
    )
  }

  async sendMagicLinkEmail(input: SendLinkEmailInput): Promise<void> {
    await this.send(
      input.to,
      `Sign in to ${this.appName}`,
      <MagicLinkEmail
        url={input.url}
        email={input.to}
        appName={this.appName}
        expirationMinutes={input.expirationMinutes}
      />
    )
  }

  async sendOtpEmail(input: SendOtpEmailInput): Promise<void> {
    const subject =
      input.type === "sign-in" ? "Your sign-in code" : "Verify your email"
    await this.send(
      input.to,
      subject,
      <OtpEmail
        verificationCode={input.otp}
        email={input.to}
        appName={this.appName}
        expirationMinutes={input.expirationMinutes}
      />
    )
  }

  async sendOrganizationInvitationEmail(
    input: OrganizationInvitationEmailInput
  ): Promise<void> {
    await this.send(
      input.to,
      `Join ${input.organizationName}`,
      <OrganizationInvitationEmail
        url={input.url}
        email={input.to}
        appName={this.appName}
        organizationName={input.organizationName}
        inviterName={input.inviterName}
        inviterEmail={input.inviterEmail}
        role={input.role}
        expirationHours={input.expirationHours}
      />
    )
  }
}
