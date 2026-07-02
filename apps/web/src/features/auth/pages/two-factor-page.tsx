import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { twoFactorSchema } from "@workspace/contracts"
import { AuthOtpInput, AuthPageBody, AuthPageHeader } from "@workspace/ui/auth"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field"
import { useVerifyTotp } from "@workspace/auth/react"
import { routes, defaultAuthenticatedRoute } from "@/config/routes"
import {
  getSafeRedirectPath,
  withAuthRedirectQuery,
} from "@/routing/safe-redirect"

export function TwoFactorPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectPath = getSafeRedirectPath(
    searchParams.get("redirect"),
    defaultAuthenticatedRoute
  )
  const verifyTotp = useVerifyTotp()
  const [code, setCode] = useState("")
  const [codeError, setCodeError] = useState<string>()

  async function handleComplete(value: string) {
    const result = twoFactorSchema.safeParse({ code: value })
    if (!result.success) {
      setCodeError(result.error.issues[0]?.message ?? "Enter the 6-digit code")
      setCode("")
      return
    }

    setCodeError(undefined)
    try {
      await verifyTotp.mutateAsync({ code: value })
      navigate(redirectPath)
    } catch {
      setCodeError("Check your authenticator app and try again.")
      setCode("")
    }
  }

  return (
    <AuthPageBody
      footer={
        <Link
          className="font-sans text-sm text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
          to={withAuthRedirectQuery(routes.signIn, {
            redirect: searchParams.get("redirect"),
            fallback: defaultAuthenticatedRoute,
          })}
        >
          Back to sign in
        </Link>
      }
    >
      <AuthPageHeader
        description="Please enter the code from your authenticator app."
        title="Verify your identity"
      />

      <Field invalid={Boolean(codeError)}>
        <FieldLabel htmlFor="two-factor-code">Verification code</FieldLabel>
        <AuthOtpInput
          id="two-factor-code"
          invalid={!!codeError}
          onComplete={(value) => void handleComplete(value)}
          onValueChange={(value) => {
            setCode(value)
            if (codeError) setCodeError(undefined)
          }}
          value={code}
          verifying={verifyTotp.isPending}
        />
        <FieldDescription>
          Open your authenticator app (1Password, Authy, etc.) to get a 6-digit
          code.
        </FieldDescription>
        <FieldError match={Boolean(codeError)}>{codeError}</FieldError>
      </Field>
    </AuthPageBody>
  )
}
