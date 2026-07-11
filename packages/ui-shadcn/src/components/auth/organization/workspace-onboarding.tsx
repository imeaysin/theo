"use client"

import { useAuthSession, useAuthUiConfig } from "@workspace/auth/react"
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
import { type UseFormReturn } from "react-hook-form"
import { AuthBrandLogo } from "../auth-brand-logo"
import { DefaultAuthLink, type AuthLinkComponent } from "../auth-shell"
import { AuthPageBody } from "../auth-form"
import { AuthPageHeader } from "../auth-page-header"
import { UserView } from "../user/user-view"

type WorkspaceOnboardingValues = { name: string }

export type WorkspaceOnboardingProps = {
  form: UseFormReturn<WorkspaceOnboardingValues>
  onSubmit: () => void
  isPending?: boolean
  onSignOut?: () => void
  homeHref?: string
  linkComponent?: AuthLinkComponent
  title?: string
  description?: string
  submitLabel?: string
}

export function WorkspaceOnboarding({
  form,
  onSubmit,
  isPending = false,
  onSignOut,
  homeHref = "/",
  linkComponent: Link = DefaultAuthLink,
  title = "Create your workspace",
  description = "Pick a name to get started. You can invite teammates later.",
  submitLabel = "Continue",
}: WorkspaceOnboardingProps) {
  const config = useAuthUiConfig()
  const { data: session } = useAuthSession()

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut()
      return
    }
    config.navigate(config.routes.signOut)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between px-4 py-4 md:px-6">
        <Link
          className="flex items-center transition-opacity hover:opacity-80"
          href={homeHref}
        >
          <AuthBrandLogo />
        </Link>
        <Button
          className="text-muted-foreground"
          onClick={handleSignOut}
          type="button"
          variant="ghost"
        >
          Sign out
        </Button>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-12">
        <div className="w-full max-w-sm">
          <AuthPageBody
            footer={
              session?.user?.email ? (
                <p className="text-xs text-muted-foreground">
                  Signed in as {session.user.email}.{" "}
                  <Button
                    className="h-auto p-0 text-xs"
                    onClick={handleSignOut}
                    type="button"
                    variant="link"
                  >
                    Use a different account
                  </Button>
                </p>
              ) : null
            }
          >
            <AuthPageHeader description={description} title={title} />

            {session?.user ? (
              <UserView className="justify-center" user={session.user} />
            ) : null}

            <Form {...form}>
              <form
                className="flex flex-col gap-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          autoFocus
                          disabled={isPending}
                          placeholder="Acme Inc."
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className="w-full" disabled={isPending} type="submit">
                  {submitLabel}
                </Button>
              </form>
            </Form>
          </AuthPageBody>
        </div>
      </main>
    </div>
  )
}
