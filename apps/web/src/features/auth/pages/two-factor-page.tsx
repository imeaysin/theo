import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@workspace/auth/client"
import { TwoFactorSchema, type TwoFactorInput } from "@workspace/contracts"
import { Button } from "@workspace/ui-shadcn/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui-shadcn/components/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui-shadcn/components/field"
import { Input } from "@workspace/ui-shadcn/components/input"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import { defaultAuthenticatedRoute } from "@/config/routes"

export function TwoFactorPage() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)
  const form = useForm<TwoFactorInput>({
    resolver: zodResolver(TwoFactorSchema),
    defaultValues: { code: "" },
  })

  async function onSubmit(values: TwoFactorInput) {
    setFormError(null)
    const result = await authClient.twoFactor.verifyTotp({
      code: values.code,
    })

    if (result.error) {
      setFormError(result.error.message ?? "Invalid code")
      return
    }

    navigate(defaultAuthenticatedRoute, { replace: true })
  }

  const codeError = form.formState.errors.code
  const isSubmitting = form.formState.isSubmitting

  return (
    <Card>
      <CardHeader>
        <CardTitle>Two-factor authentication</CardTitle>
        <CardDescription>
          Enter the 6-digit code from your authenticator app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Field data-invalid={codeError ? true : undefined}>
              <FieldLabel htmlFor="code">Authentication code</FieldLabel>
              <Input
                aria-invalid={Boolean(codeError)}
                autoComplete="one-time-code"
                id="code"
                inputMode="numeric"
                {...form.register("code")}
              />
              <FieldError errors={[codeError]} />
            </Field>
          </FieldGroup>
          {formError ? (
            <p className="text-sm text-destructive">{formError}</p>
          ) : null}
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
            Verify
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
