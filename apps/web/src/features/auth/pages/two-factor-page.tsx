import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthOtpInput, AuthPageBody, AuthPageHeader } from "@workspace/ui/auth"
import { toastManager } from "@workspace/ui/components/toast"
import { useVerifyTotpMutation } from "@/features/auth/hooks/use-auth-mutations"
import { defaultAuthenticatedRoute, routes } from "@/config/routes"

export function TwoFactorPage() {
  const navigate = useNavigate()
  const verifyTotp = useVerifyTotpMutation()
  const [code, setCode] = useState("")
  const [invalid, setInvalid] = useState(false)

  async function handleComplete(value: string) {
    setInvalid(false)
    try {
      await verifyTotp.mutateAsync({ code: value })
      navigate(defaultAuthenticatedRoute)
    } catch {
      setInvalid(true)
      setCode("")
      toastManager.add({
        title: "Invalid code",
        description: "Check your authenticator app and try again.",
        type: "error",
      })
    }
  }

  return (
    <AuthPageBody
      footer={
        <Link
          className="font-sans text-sm text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
          to={routes.signIn}
        >
          Back to sign in
        </Link>
      }
    >
      <AuthPageHeader
        description="Please enter the code from your authenticator app."
        title="Verify your identity"
      />

      <div className="flex flex-col gap-6">
        <AuthOtpInput
          invalid={invalid}
          onComplete={(value) => void handleComplete(value)}
          onValueChange={setCode}
          value={code}
          verifying={verifyTotp.isPending}
        />

        <p className="text-center font-mono text-xs text-muted-foreground">
          Open your authenticator apps like 1Password, Authy, etc. to verify
          your identity.
        </p>
      </div>
    </AuthPageBody>
  )
}
