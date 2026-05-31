import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { Button } from "@workspace/ui/components/button"
import { FormField } from "@/components/form/form-field"
import { paths } from "@/config/paths"
import { AuthCard } from "@/features/auth/components/auth-card"
import { useVerifyTwoFactor } from "@/features/auth/hooks/use-verify-two-factor"
import { twoFactorSchema, type TwoFactorInput } from "@repo/contracts"

export function TwoFactorPage() {
  const verifyMutation = useVerifyTwoFactor()
  const form = useForm<TwoFactorInput>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: { code: "" },
  })

  function onSubmit(values: TwoFactorInput) {
    verifyMutation.mutate(values)
  }

  return (
    <AuthCard
      title="Two-factor authentication"
      description="Enter the 6-digit code from your authenticator app."
      footer={
        <Link to={paths.auth.signIn} className="text-foreground underline">
          Back to sign in
        </Link>
      }
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        {verifyMutation.error ? (
          <Alert variant="error">
            <AlertDescription>{verifyMutation.error.message}</AlertDescription>
          </Alert>
        ) : null}

        <FormField
          control={form.control}
          name="code"
          label="Authentication code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
        />

        <Button type="submit" disabled={verifyMutation.isPending}>
          {verifyMutation.isPending ? "Verifying…" : "Verify"}
        </Button>
      </form>
    </AuthCard>
  )
}
