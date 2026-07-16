import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Button } from "@workspace/ui-shadcn/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui-shadcn/components/card"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import { routes } from "@/config/routes"
import { resendVerificationEmail } from "@/features/auth/lib/resend-verification-email"

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get("email")
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)

  async function handleResend() {
    if (!email) {
      setStatusMessage("Enter your email on the sign-up form to resend.")
      return
    }

    setIsSending(true)
    setStatusMessage(null)
    const result = await resendVerificationEmail(email)
    setIsSending(false)
    setStatusMessage(result.message)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>
          {email
            ? `We sent a verification link to ${email}.`
            : "Check your inbox for a verification link."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
        <p>
          Email/password sign-in stays blocked until verification completes.
          Google sign-in does not require this step.
        </p>
        {statusMessage ? <p>{statusMessage}</p> : null}
        {email ? (
          <Button disabled={isSending} onClick={() => void handleResend()}>
            {isSending ? <Spinner data-icon="inline-start" /> : null}
            {isSending ? "Sending…" : "Resend verification email"}
          </Button>
        ) : null}
      </CardContent>
      <CardFooter>
        <Link className="text-sm underline" to={routes.signIn}>
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  )
}
