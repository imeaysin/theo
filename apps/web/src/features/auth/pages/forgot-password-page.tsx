import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@workspace/contracts"
import { AuthPageBody, AuthPageHeader } from "@workspace/ui/auth"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { toastManager } from "@workspace/ui/components/toast"
import { useForgotPasswordMutation } from "@/features/auth/hooks/use-auth-mutations"
import { routes } from "@/config/routes"

export function ForgotPasswordPage() {
  const forgotPassword = useForgotPasswordMutation()
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: ForgotPasswordInput) {
    try {
      await forgotPassword.mutateAsync(values)
      toastManager.add({
        title: "Check your email",
        description: "If an account exists, a reset link has been sent.",
        type: "success",
      })
    } catch {
      toastManager.add({
        title: "Request failed",
        description: "Could not send a reset link. Please try again.",
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
        description="Enter your email and we'll send you a reset link."
        title="Forgot password"
      />

      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            autoComplete="email"
            type="email"
            {...form.register("email")}
            aria-invalid={!!form.formState.errors.email}
          />
          {form.formState.errors.email ? (
            <FieldError>{form.formState.errors.email.message}</FieldError>
          ) : null}
        </Field>
        <Button
          className="w-full"
          loading={forgotPassword.isPending}
          size="lg"
          type="submit"
          variant="default"
        >
          Send reset link
        </Button>
      </form>
    </AuthPageBody>
  )
}
