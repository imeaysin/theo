import { Resend } from "resend"
import { env } from "@repo/config"
import { WelcomeEmail } from "./templates/welcome"
import { VerificationEmail } from "./templates/verification-email"
import { ResetPasswordEmail } from "./templates/reset-password"

export const resend = new Resend(env.RESEND_API_KEY)

const FROM_ADDRESS = `${env.APP_NAME} <no-reply@${new URL(env.CLIENT_URL).hostname}>`

export async function sendWelcomeEmail(to: string, name: string) {
  return resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `Welcome to ${env.APP_NAME}!`,
    react: <WelcomeEmail name={name} />,
  })
}

export async function sendVerificationEmail(to: string, url: string) {
  return resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Verify your email",
    react: <VerificationEmail url={url} />,
  })
}

export async function sendResetPasswordEmail(to: string, url: string) {
  return resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Reset your password",
    react: <ResetPasswordEmail url={url} />,
  })
}
