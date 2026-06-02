import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { Alert, Button } from "@workspace/hero-ui"
import { FormField } from "@/components/form/form-field"
import { paths } from "@/config/paths"
import { AuthCard } from "@/features/auth/components/auth-card"
import { useForgotPassword } from "@/features/auth/hooks/use-forgot-password"
import { forgotPasswordSchema, type ForgotPasswordInput } from "@repo/contracts"

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
        <Alert status="success">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>
              If an account exists for that email, you will receive reset
              instructions shortly.
            </Alert.Description>
          </Alert.Content>
        </Alert>
      ) : (
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          {forgotPasswordMutation.error ? (
            <Alert status="danger">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Description>
                  {forgotPasswordMutation.error.message}
                </Alert.Description>
              </Alert.Content>
            </Alert>
          ) : null}

          <FormField
            control={form.control}
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
          />

          <Button type="submit" isPending={forgotPasswordMutation.isPending}>
            {forgotPasswordMutation.isPending ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthCard>
  )
}
