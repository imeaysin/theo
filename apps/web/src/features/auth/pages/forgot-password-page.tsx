import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { Button } from "@workspace/ui/components/button"
import { FormField } from "@/components/form/form-field"
import { paths } from "@/config/paths"
import { AuthCard } from "@/features/auth/components/auth-card"
import { useForgotPassword } from "@/features/auth/hooks/use-forgot-password"
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@repo/contracts"

export function ForgotPasswordPage() {
  const forgotPasswordMutation = useForgotPassword()
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  function onSubmit(values: ForgotPasswordInput) {
    forgotPasswordMutation.mutate(values)
  }

  return (
    <AuthCard
      title="Forgot password"
      description="We'll email you a link to reset your password."
      footer={
        <Link to={paths.auth.signIn} className="text-foreground underline">
          Back to sign in
        </Link>
      }
    >
      {forgotPasswordMutation.isSuccess ? (
        <Alert>
          <AlertDescription>
            If an account exists for that email, you will receive reset
            instructions shortly.
          </AlertDescription>
        </Alert>
      ) : (
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          {forgotPasswordMutation.error ? (
            <Alert variant="error">
              <AlertDescription>
                {forgotPasswordMutation.error.message}
              </AlertDescription>
            </Alert>
          ) : null}

          <FormField
            control={form.control}
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
          />

          <Button type="submit" disabled={forgotPasswordMutation.isPending}>
            {forgotPasswordMutation.isPending ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthCard>
  )
}
