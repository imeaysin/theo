import { zodResolver } from "@hookform/resolvers/zod"
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { SignInSchema, type SignInInput } from "@workspace/contracts"
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
import { PasswordInput } from "@workspace/ui-shadcn/components/password-input"
import { PageLoading } from "@workspace/ui-shadcn/components/page-loading"
import { AuthButtons } from "@/features/auth/components/auth-buttons"
import { useSignInEmail, useAuthSession } from "@workspace/auth/react"
import { defaultAuthenticatedRoute, routes } from "@/config/routes"
import { site } from "@/config/site"
import {
  getSafeRedirectPath,
  withAuthRedirectQuery,
} from "@/routing/safe-redirect"

function getSignInErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "code" in error) {
    const code = String((error as { code: string }).code)
    if (code === "EMAIL_NOT_VERIFIED") {
      return "Verify your email before signing in."
    }
  }
  return "Check your email and password, then try again."
}

export function SignInPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectPath = getSafeRedirectPath(
    searchParams.get("redirect"),
    defaultAuthenticatedRoute
  )
  const { data: session, isPending } = useAuthSession()
  const signIn = useSignInEmail()
  const form = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: "", password: "" },
  })

  if (isPending) {
    return <PageLoading />
  }

  if (session) {
    return <Navigate replace to={redirectPath} />
  }

  async function onSubmit(values: SignInInput) {
    try {
      const data = await signIn.mutateAsync(values)
      if (data && "twoFactorRedirect" in data && data.twoFactorRedirect) {
        navigate(
          withAuthRedirectQuery(routes.twoFactor, {
            redirect: searchParams.get("redirect"),
            fallback: defaultAuthenticatedRoute,
          })
        )
        return
      }
      navigate(redirectPath)
    } catch (error) {
      const message = getSignInErrorMessage(error)
      if (message.includes("Verify your email")) {
        form.setError("email", { message })
        navigate(
          `${routes.verifyEmail}?email=${encodeURIComponent(values.email)}`
        )
        return
      }
      form.setError("password", { message })
    }
  }

  return (
    <AuthPageBody
      footer={
        <p className="font-sans text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            className="text-foreground underline underline-offset-2 transition-colors hover:text-foreground/80"
            to={withAuthRedirectQuery(routes.signUp, {
              redirect: searchParams.get("redirect"),
              fallback: defaultAuthenticatedRoute,
            })}
          >
            Sign up
          </Link>
        </p>
      }
    >
      <AuthPageHeader
        description="Sign in or create an account"
        title={`Welcome to ${site.name}`}
      />

      <AuthButtons callbackPath={redirectPath} />

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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Link
              className="font-sans text-sm text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
              to={routes.forgotPassword}
            >
              Forgot password?
            </Link>
          </div>
          <Button
            className="w-full"
            disabled={signIn.isPending}
            size="lg"
            type="submit"
          >
            Sign in
          </Button>
        </form>
      </Form>
    </AuthPageBody>
  )
}
