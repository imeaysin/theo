import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import {
  ResetPasswordSchema,
  type ResetPasswordInput,
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
import { PasswordInput } from "@workspace/ui-shadcn/components/password-input"
import { toastManager } from "@workspace/ui-shadcn/components/toast"
import { useResetPassword } from "@workspace/auth/react"
import { routes } from "@/config/routes"

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token") ?? ""
  const resetPassword = useResetPassword()
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  async function onSubmit(values: ResetPasswordInput) {
    if (!token) {
      form.setError("password", {
        message: "This reset link is missing or expired.",
      })
      return
    }

    try {
      await resetPassword.mutateAsync({ input: values, token })
      toastManager.add({
        title: "Password updated",
        description: "You can now sign in with your new password.",
        type: "success",
      })
      navigate(routes.signIn)
    } catch {
      form.setError("password", {
        message: "Could not reset your password. Request a new link.",
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
        description="Choose a new password for your account."
        title="Reset password"
      />

      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    autoComplete="new-password"
                    placeholder="Enter a new password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="w-full"
            disabled={resetPassword.isPending}
            size="lg"
            type="submit"
          >
            Update password
          </Button>
        </form>
      </Form>
    </AuthPageBody>
  )
}
