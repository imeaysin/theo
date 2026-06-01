import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { Button } from "@workspace/ui/components/button"
import { FormField } from "@/components/form/form-field"
import { paths } from "@/config/paths"
import { AuthCard } from "@/features/auth/components/auth-card"
import { AuthDivider } from "@/features/auth/components/auth-divider"
import { GoogleAuthButton } from "@/features/auth/components/google-auth-button"
import { useSignUp } from "@/features/auth/hooks/use-sign-up"
import { signUpSchema, type SignUpInput } from "@repo/contracts"

export function SignUpPage() {
  const signUpMutation = useSignUp()
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  function onSubmit(values: SignUpInput) {
    signUpMutation.mutate(values)
  }

  return (
    <AuthCard
      title="Create an account"
      description="Get started with your email and password."
      footer={
        <>
          Already have an account?{" "}
          <Link to={paths.auth.signIn} className="text-foreground underline">
            Sign in
          </Link>
        </>
      }
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        {signUpMutation.error ? (
          <Alert variant="error">
            <AlertDescription>{signUpMutation.error.message}</AlertDescription>
          </Alert>
        ) : null}

        <FormField
          control={form.control}
          name="name"
          label="Name"
          autoComplete="name"
        />
        <FormField
          control={form.control}
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
        />
        <FormField
          control={form.control}
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
        />

        <Button type="submit" disabled={signUpMutation.isPending}>
          {signUpMutation.isPending ? "Creating account…" : "Sign up"}
        </Button>
      </form>

      <AuthDivider />
      <GoogleAuthButton />
    </AuthCard>
  )
}
