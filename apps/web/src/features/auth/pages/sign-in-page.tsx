import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { Alert, Button } from "@workspace/hero-ui"
import { FormField } from "@/components/form/form-field"
import { paths } from "@/config/paths"
import { AuthCard } from "@/features/auth/components/auth-card"
import { AuthDivider } from "@/features/auth/components/auth-divider"
import { GoogleAuthButton } from "@/features/auth/components/google-auth-button"
import { useSignIn } from "@/features/auth/hooks/use-sign-in"
import { signInSchema, type SignInInput } from "@repo/contracts"

export function SignInPage() {
  const signInMutation = useSignIn()
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  })

  function onSubmit(values: SignInInput) {
    signInMutation.mutate(values)
  }

  return (
    <AuthCard
      title="Sign in"
      description="Welcome back. Enter your credentials to continue."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to={paths.auth.signUp} className="text-foreground underline">
            Sign up
          </Link>
        </>
      }
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        {signInMutation.error ? (
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>
                {signInMutation.error.message}
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
        <FormField
          control={form.control}
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
        />

        <div className="flex justify-end">
          <Link
            to={paths.auth.forgotPassword}
            className="text-sm text-muted-foreground hover:text-foreground hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" isPending={signInMutation.isPending}>
          {signInMutation.isPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <AuthDivider />
      <GoogleAuthButton />
    </AuthCard>
  )
}
