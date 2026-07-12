import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { TwoFactorSchema, type TwoFactorInput } from "@workspace/contracts"
import {
  AuthOtpInput,
  AuthPageBody,
  AuthPageHeader,
} from "@workspace/ui-shadcn/auth"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui-shadcn/components/form"
import { useVerifyTotp } from "@workspace/auth/react"
import { routes, defaultAuthenticatedRoute } from "@/config/routes"
import {
  getSafeRedirectPath,
  withAuthRedirectQuery,
} from "@/routing/safe-redirect"

export function TwoFactorPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectPath = getSafeRedirectPath(
    searchParams.get("redirect"),
    defaultAuthenticatedRoute
  )
  const verifyTotp = useVerifyTotp()

  const form = useForm<TwoFactorInput>({
    resolver: zodResolver(TwoFactorSchema),
    defaultValues: { code: "" },
  })

  async function onSubmit(values: TwoFactorInput) {
    try {
      await verifyTotp.mutateAsync(values)
      navigate(redirectPath)
    } catch {
      form.setError("code", {
        message: "Check your authenticator app and try again.",
      })
      form.setValue("code", "")
    }
  }

  return (
    <AuthPageBody
      footer={
        <Link
          className="font-sans text-sm text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
          to={withAuthRedirectQuery(routes.signIn, {
            redirect: searchParams.get("redirect"),
            fallback: defaultAuthenticatedRoute,
          })}
        >
          Back to sign in
        </Link>
      }
    >
      <AuthPageHeader
        description="Please enter the code from your authenticator app."
        title="Verify your identity"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification code</FormLabel>
                <FormControl>
                  <AuthOtpInput
                    invalid={Boolean(form.formState.errors.code)}
                    onComplete={(value) => {
                      form.setValue("code", value, { shouldValidate: true })
                      void form.handleSubmit(onSubmit)()
                    }}
                    onValueChange={field.onChange}
                    value={field.value}
                    verifying={verifyTotp.isPending}
                  />
                </FormControl>
                <FormDescription>
                  Open your authenticator app (1Password, Authy, etc.) to get a
                  6-digit code.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </AuthPageBody>
  )
}
