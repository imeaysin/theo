import { authQueryKeys } from "@better-auth-ui/core"
import {
  useAuth,
  useAuthPlugin,
  useDeleteUser,
  useListAccounts,
} from "@better-auth-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { TriangleAlert } from "lucide-react"
import { type SyntheticEvent, useState } from "react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui-shadcn/components/alert-dialog"
import { Button, buttonVariants } from "@workspace/ui-shadcn/components/button"
import { Card, CardContent } from "@workspace/ui-shadcn/components/card"
import { Field, FieldError } from "@workspace/ui-shadcn/components/field"
import { Input } from "@workspace/ui-shadcn/components/input"
import { Label } from "@workspace/ui-shadcn/components/label"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import { deleteUserPlugin } from "@workspace/ui-shadcn/lib/auth/delete-user-plugin"
import { cn } from "@workspace/ui-shadcn/lib/utils"

export type DeleteAccountProps = {
  className?: string
}

/**
 * Danger-zone card to delete the authenticated account, with a confirmation dialog and toasts.
 */
export function DeleteAccount({ className }: DeleteAccountProps) {
  const { authClient, basePaths, localization, viewPaths, navigate } = useAuth()

  const {
    localization: deleteUserLocalization,
    sendDeleteAccountVerification,
  } = useAuthPlugin(deleteUserPlugin)

  const { data: accounts } = useListAccounts(authClient)

  const queryClient = useQueryClient()

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [password, setPassword] = useState("")

  const hasCredentialAccount = accounts?.some(
    (account) => account.providerId === "credential"
  )
  const needsPassword = !sendDeleteAccountVerification && hasCredentialAccount

  const { mutate: deleteUser, isPending } = useDeleteUser(authClient)

  const handleDialogOpenChange = (open: boolean) => {
    setConfirmOpen(open)
    setPassword("")
  }

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const params = {
      ...(needsPassword ? { password } : {}),
    }

    deleteUser(params, {
      onSuccess: () => {
        setConfirmOpen(false)
        setPassword("")

        if (sendDeleteAccountVerification) {
          toast.success(deleteUserLocalization.deleteUserVerificationSent)
        } else {
          toast.success(deleteUserLocalization.deleteUserSuccess)
          queryClient.removeQueries({ queryKey: authQueryKeys.all })
          navigate({
            to: `${basePaths.auth}/${viewPaths.auth.signIn}`,
            replace: true,
          })
        }
      },
    })
  }

  return (
    <Card className={cn("border-destructive", className)}>
      <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm leading-tight font-medium">
            {deleteUserLocalization.deleteAccount}
          </p>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {deleteUserLocalization.deleteAccountDescription}
          </p>
        </div>

        <AlertDialog open={confirmOpen} onOpenChange={handleDialogOpenChange}>
          <AlertDialogTrigger
            className={cn(
              buttonVariants({ variant: "destructive", size: "sm" })
            )}
            disabled={!accounts}
          >
            {deleteUserLocalization.deleteAccount}
          </AlertDialogTrigger>

          <AlertDialogContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                  <TriangleAlert />
                </AlertDialogMedia>

                <AlertDialogTitle>
                  {deleteUserLocalization.deleteAccount}
                </AlertDialogTitle>

                <AlertDialogDescription>
                  {deleteUserLocalization.deleteAccountDescription}
                </AlertDialogDescription>
              </AlertDialogHeader>

              {needsPassword && (
                <Field>
                  <Label htmlFor="delete-password">
                    {localization.auth.password}
                  </Label>

                  <Input
                    id="delete-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder={localization.auth.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isPending}
                    required
                  />

                  <FieldError />
                </Field>
              )}

              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>
                  {localization.settings.cancel}
                </AlertDialogCancel>

                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isPending}
                >
                  {isPending && <Spinner />}

                  {deleteUserLocalization.deleteAccount}
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
