import { env } from "@/config/env"
import { buildAuthCallback } from "@/features/auth/lib/auth-callback"
import { routes } from "@/config/routes"

type ResendVerificationResult =
  | { readonly ok: true; readonly message: string }
  | { readonly ok: false; readonly message: string }

type VerificationErrorBody = {
  readonly message?: string
}

export async function resendVerificationEmail(
  email: string
): Promise<ResendVerificationResult> {
  const response = await fetch(
    `${env.apiUrl}/api/auth/send-verification-email`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        callbackURL: buildAuthCallback(routes.verifyEmail),
      }),
    }
  )

  if (response.ok) {
    return { ok: true, message: "Verification email sent." }
  }

  const body = await readVerificationErrorBody(response)
  return {
    ok: false,
    message: body.message ?? "Unable to send verification email.",
  }
}

async function readVerificationErrorBody(
  response: Response
): Promise<VerificationErrorBody> {
  try {
    const body: VerificationErrorBody = await response.json()
    return body
  } catch {
    return {}
  }
}
