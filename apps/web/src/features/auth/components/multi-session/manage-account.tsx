"use client"

import {
  type ListDeviceSession,
  type MultiSessionAuthClient,
  useAuth,
  useAuthPlugin,
  useRevokeMultiSession,
  useSession,
  useSetActiveSession,
} from "@better-auth-ui/react"
import { ArrowLeftRight, LogOut, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"
import { UserView } from "@/features/auth/components/user/user-view"
import { Button, buttonVariants } from "@workspace/ui-shadcn/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui-shadcn/components/dropdown-menu"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import { multiSessionPlugin } from "@/lib/auth/multi-session-plugin"
import { cn } from "@workspace/ui-shadcn/lib/utils"

export type ManageAccountProps = {
  deviceSession?: ListDeviceSession | null
  isPending?: boolean
}

/**
 * Render a single account row with user info and switch/revoke controls.
 *
 * Shows the user's avatar and info. For the active session, shows a sign-out button.
 * For non-active sessions, shows a dropdown menu with switch and sign-out options.
 *
 * @param deviceSession - The device session object containing session and user data
 * @param isPending - Whether the device session is pending
 * @returns A JSX element containing the account row
 */
export function ManageAccount({
  deviceSession,
  isPending,
}: ManageAccountProps) {
  const { authClient, localization } = useAuth()
  const { localization: multiSessionLocalization } =
    useAuthPlugin(multiSessionPlugin)
  const { data: session } = useSession(authClient)

  const { mutate: setActiveSession, isPending: isSwitching } =
    useSetActiveSession(authClient as MultiSessionAuthClient, {
      onSuccess: () => window.scrollTo({ top: 0 }),
    })

  const { mutate: revokeSession, isPending: isRevoking } =
    useRevokeMultiSession(authClient as MultiSessionAuthClient, {
      onSuccess: () =>
        toast.success(localization.settings.revokeSessionSuccess),
    })

  const isActive = deviceSession?.session.userId === session?.session.userId
  const isBusy = isSwitching || isRevoking

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-4">
      <UserView user={deviceSession?.user} isPending={isPending} />

      {deviceSession && isActive && (
        <Button
          className="shrink-0"
          variant="outline"
          size="sm"
          onClick={() =>
            revokeSession({ sessionToken: deviceSession.session.token })
          }
          disabled={isBusy}
        >
          {isRevoking ? <Spinner /> : <LogOut />}
          {localization.auth.signOut}
        </Button>
      )}

      {deviceSession && !isActive && (
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-sm" }),
              "shrink-0"
            )}
            disabled={isBusy}
          >
            <MoreHorizontal />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="min-w-fit">
            <DropdownMenuItem
              onClick={() =>
                setActiveSession({
                  sessionToken: deviceSession.session.token,
                })
              }
            >
              <ArrowLeftRight className="text-muted-foreground" />
              {multiSessionLocalization.switchAccount}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                revokeSession({
                  sessionToken: deviceSession.session.token,
                })
              }
            >
              <LogOut className="text-muted-foreground" />
              {localization.auth.signOut}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
