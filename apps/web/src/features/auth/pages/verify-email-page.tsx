import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { AuthPageBody, AuthPageHeader } from "@workspace/ui/auth"
import { Button } from "@workspace/ui/components/button"
import { PageLoading } from "@workspace/ui/components/page-loading"
import { toastManager } from "@workspace/ui/components/toast"
import { useSendVerificationEmailMutation } from "@/features/auth/hooks/use-auth-mutations"
import { authClient } from "@/lib/auth"
import { paths } from "@/config/paths"

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get("email") ?? ""
  const token = searchParams.get("token")
  const [verifying, setVerifying] = useState(!!token)
  const [verified, setVerified] = useState(false)
  const sendVerification = useSendVerificationEmailMutation()

  useEffect(() => {
    if (!token) return

    void authClient.verifyEmail({ query: { token } }).then(({ error }) => {
      setVerifying(false)
      if (error) {
        toastManager.add({
          title: "Verification failed",
          description: "This link is invalid or has expired.",
          type: "error",
        })
        return
      }
      setVerified(true)
      toastManager.add({
        title: "Email verified",
        description: "Your account is ready. You can sign in now.",
        type: "success",
      })
    })
  }, [token])

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
      await sendVerification.mutateAsync(email)
      toastManager.add({
        title: "Email sent",
        description: "Check your inbox for a new verification link.",
        type: "success",
      })
    } catch {
      toastManager.add({
        title: "Could not resend",
        description: "Please try again in a moment.",
        type: "error",
      })
    }
  }

  if (verifying) {
    return <PageLoading message="Verifying your email…" />
  }

  return (
    <AuthPageBody>
      <AuthPageHeader
        description={
          verified
            ? "Your email address has been verified."
            : "We sent a verification link to your email. Open it to activate your account."
        }
        title={verified ? "You're all set" : "Verify your email"}
      />

      <div className="flex flex-col gap-3">
        {!verified && email ? (
          <Button
            className="w-full"
            loading={sendVerification.isPending}
            onClick={() => void resendEmail()}
            size="lg"
            type="button"
            variant="outline"
          >
            Resend verification email
          </Button>
        ) : null}
        <Button
          className="w-full"
          render={<Link to={paths.auth.signIn} />}
          size="lg"
          type="button"
          variant="default"
        >
          {verified ? "Continue to sign in" : "Back to sign in"}
        </Button>
      </div>
    </AuthPageBody>
  )
}
