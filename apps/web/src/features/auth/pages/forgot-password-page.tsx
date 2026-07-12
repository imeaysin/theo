import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import {
  ForgotPasswordSchema,
  type ForgotPasswordInput,
} from "@workspace/contracts"
import { AuthPageBody, AuthPageHeader } from "@workspace/ui-shadcn/auth"
import { Button } from "@workspace/ui-shadcn/components/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui-shadcn/components/form"
import { Input } from "@workspace/ui-shadcn/components/input"
import { toastManager } from "@workspace/ui-shadcn/components/toast"
import { useRequestPasswordReset } from "@workspace/auth/react"
import { absoluteAppUrl, routes } from "@/config/routes"

export function ForgotPasswordPage() {
  const forgotPassword = useRequestPasswordReset()
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: ForgotPasswordInput) {
    try {
      await forgotPassword.mutateAsync({
        email: values.email,
        redirectTo: absoluteAppUrl(routes.resetPassword),
      })
      toastManager.add({
        title: "Check your email",
        description: "If an account exists, a reset link has been sent.",
        type: "success",
      })
    } catch {
      form.setError("email", {
        message: "Could not send a reset link. Please try again.",
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

      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="email"
                    placeholder="you@example.com"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="w-full"
            disabled={forgotPassword.isPending}
            size="lg"
            type="submit"
          >
            Send reset link
          </Button>
        </form>
      </Form>
    </AuthPageBody>
  )
}
