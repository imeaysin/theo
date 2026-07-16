import { routes } from "@/config/routes"

const EMAIL_NOT_VERIFIED_CODE = "EMAIL_NOT_VERIFIED"

export type AuthClientError = {
  readonly code?: string
  readonly message?: string
}

export type SignInFeedback = {
  readonly message: string
  readonly verifyEmailHref?: string
}

function isAuthClientError(
  error: AuthClientError | null
): error is AuthClientError {
  return error !== null
}

function buildVerifyEmailHref(email: string): string {
  return `${routes.verifyEmail}?email=${encodeURIComponent(email)}`
}

export function resolveSignInFeedback(
  error: AuthClientError | null,
  email: string
): SignInFeedback {
  if (!isAuthClientError(error)) {
    return {
      message: "Unable to sign in.",
      verifyEmailHref: buildVerifyEmailHref(email),
    }
  }

  if (error.code === EMAIL_NOT_VERIFIED_CODE) {
    return {
      message: "Verify your email before signing in.",
      verifyEmailHref: buildVerifyEmailHref(email),
    }
  }

  return {
    message:
      error.message ??
      "Unable to sign in. Check your email and password, or verify your account first.",
    verifyEmailHref: buildVerifyEmailHref(email),
  }
}
