import { zodResolver } from "@hookform/resolvers/zod"
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { SignUpSchema, type SignUpInput } from "@workspace/contracts"
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
import { toastManager } from "@workspace/ui-shadcn/components/toast"
import { AuthButtons } from "@/features/auth/components/auth-buttons"
import { useAuthSession, useSignUpEmail } from "@workspace/auth/react"
import {
  absoluteAppUrl,
  defaultAuthenticatedRoute,
  routes,
} from "@/config/routes"
import { site } from "@/config/site"
import {
  getSafeRedirectPath,
  withAuthRedirectQuery,
} from "@/routing/safe-redirect"

export function SignUpPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectPath = getSafeRedirectPath(
    searchParams.get("redirect"),
    defaultAuthenticatedRoute
  )
  const { data: session, isPending } = useAuthSession()
  const signUp = useSignUpEmail()
  const form = useForm<SignUpInput>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  if (isPending) {
    return <PageLoading />
  }

  if (session) {
    return <Navigate replace to={redirectPath} />
  }

  async function onSubmit(values: SignUpInput) {
    try {
      await signUp.mutateAsync({
        ...values,
        callbackURL: absoluteAppUrl(routes.verifyEmail),
      })
      toastManager.add({
        title: "Account created",
        description: "Check your email to verify your account.",
        type: "success",
      })
      navigate(
        `${routes.verifyEmail}?email=${encodeURIComponent(values.email)}`
      )
    } catch {
      form.setError("email", {
        message: "Could not create your account. Please try again.",
      })
    }
  }

  return (
    <AuthPageBody
      footer={
        <p className="font-sans text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            className="text-foreground underline underline-offset-2 transition-colors hover:text-foreground/80"
            to={withAuthRedirectQuery(routes.signIn, {
              redirect: searchParams.get("redirect"),
              fallback: defaultAuthenticatedRoute,
            })}
          >
            Sign in
          </Link>
        </p>
      }
    >
      <AuthPageHeader
        description="Create your account to get started"
        title={`Join ${site.name}`}
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="name"
                    placeholder="Your name"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    autoComplete="new-password"
                    placeholder="Create a password"
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
            disabled={signUp.isPending}
            size="lg"
            type="submit"
          >
            Create account
          </Button>
        </form>
      </Form>
    </AuthPageBody>
  )
}
