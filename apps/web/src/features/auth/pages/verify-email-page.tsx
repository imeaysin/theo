import { useEffect, useState } from "react"
import { Link, Navigate, useSearchParams } from "react-router-dom"
import { AuthPageBody, AuthPageHeader } from "@workspace/ui-shadcn/auth"
import { Button } from "@workspace/ui-shadcn/components/button"
import { PageLoading } from "@workspace/ui-shadcn/components/page-loading"
import { toastManager } from "@workspace/ui-shadcn/components/toast"
import {
  useSendVerificationEmail,
  useVerifyEmail,
  useAuthSession,
} from "@workspace/auth/react"
import { OpenEmailButton } from "@workspace/ui-shadcn/auth"
import {
  absoluteAppUrl,
  routes,
  defaultAuthenticatedRoute,
} from "@/config/routes"

function getVerifyEmailCopy(verified: boolean) {
  if (verified) {
    return {
      description: "Your email address has been verified.",
      title: "You're all set",
      buttonLabel: "Continue to sign in",
    }
  }

  return {
    description:
      "We sent a verification link to your email. Open it to activate your account.",
    title: "Verify your email",
    buttonLabel: "Back to sign in",
  }
}

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get("email") ?? ""
  const token = searchParams.get("token")
  const { data: session } = useAuthSession()
  const [verified, setVerified] = useState(false)
  const sendVerification = useSendVerificationEmail()
  const { mutate: verifyEmail, isPending: isVerifying } = useVerifyEmail()
  const copy = getVerifyEmailCopy(verified)

  useEffect(() => {
    if (!token) return

    verifyEmail(token, {
      onSuccess: () => {
        setVerified(true)
        toastManager.add({
          title: "Email verified",
          description: "Your account is ready. You can sign in now.",
          type: "success",
        })
      },
      onError: () => {
        toastManager.add({
          title: "Verification failed",
          description: "This link is invalid or has expired.",
          type: "error",
        })
      },
    })
  }, [token, verifyEmail])

  async function resendEmail() {
    if (!email) {
      toastManager.add({
        title: "Email required",
        description: "Sign up again or contact support to resend verification.",
        type: "error",
      })
      return
    }

    try {
      await sendVerification.mutateAsync({
        email,
        callbackURL: absoluteAppUrl(routes.verifyEmail),
      })
      toastManager.add({
        title: "Email sent",
        description: "Check your inbox for a new verification link.",
        type: "success",
      })
    } catch {
      toastManager.add({
        description: "Please try again in a moment.",
        id: "verify-email-resend-error",
        title: "Could not resend",
        type: "error",
      })
    }
  }

  if (session && (verified || !token)) {
    return <Navigate replace to={defaultAuthenticatedRoute} />
  }

  if (token && isVerifying) {
    return <PageLoading message="Verifying your email…" />
  }

  return (
    <AuthPageBody>
      <AuthPageHeader description={copy.description} title={copy.title} />

      <div className="flex flex-col gap-3">
        {!verified && email ? (
          <>
            <OpenEmailButton email={email} />
            <Button
              className="w-full"
              disabled={sendVerification.isPending}
              onClick={() => void resendEmail()}
              size="lg"
              type="button"
              variant="outline"
            >
              Resend verification email
            </Button>
          </>
        ) : null}
        <Button
          asChild
          className="w-full"
          size="lg"
          type="button"
          variant="default"
        >
          <Link to={routes.signIn}>{copy.buttonLabel}</Link>
        </Button>
      </div>
    </AuthPageBody>
  )
}
