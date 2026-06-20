import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Play } from "lucide-react"
import {
  useAuthSession,
  useAuthSessions,
  useAuthLinkedAccounts,
} from "../hooks"
import {
  useAuthUpdateUser,
  useAuthChangeEmail,
  useAuthChangePassword,
  useAuthLinkSocial,
  useAuthUnlinkAccount,
  useAuthRevokeSession,
} from "../hooks/use-auth-mutations"

import { SettingsProfileForm } from "@workspace/ui/components/auth/settings-profile-form"
import { ChangeEmailForm } from "@workspace/ui/components/auth/change-email-form"
import { ChangePasswordForm } from "@workspace/ui/components/auth/change-password-form"
import { ActiveSessionsList } from "@workspace/ui/components/auth/active-sessions-list"
import {
  LinkedAccountsList,
  type AvailableProvider,
} from "@workspace/ui/components/auth/linked-accounts-list"

import {
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@workspace/ui/components/tabs"

/**
 * Settings Page
 *
 * Provides Account and Security settings, replacing hero-ui <Settings />
 */
export function SettingsPage() {
  const params = useParams()
  const tab = params.tab
  const navigate = useNavigate()
  const view = tab || "account"

  // Queries
  const { session, isPending: isSessionPending } = useAuthSession()
  const { sessions, isPending: isSessionsPending } = useAuthSessions()
  const { accounts, isPending: isAccountsPending } = useAuthLinkedAccounts()

  // Mutations
  const { mutateAsync: updateUser, isPending: isUpdatingProfile } =
    useAuthUpdateUser()
  const { mutateAsync: changeEmail, isPending: isChangingEmail } =
    useAuthChangeEmail()
  const { mutateAsync: changePassword, isPending: isChangingPassword } =
    useAuthChangePassword()
  const { mutateAsync: linkSocial } = useAuthLinkSocial()
  const { mutateAsync: unlinkAccount } = useAuthUnlinkAccount()
  const { mutateAsync: revokeSession } = useAuthRevokeSession()

  // Track which provider is currently pending a link/unlink action
  const [pendingProviderId, setPendingProviderId] = useState<string | null>(
    null
  )
  // Track which session is currently being revoked
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(
    null
  )

  // Loading state
  const isPending = isSessionPending || isSessionsPending || isAccountsPending

  if (isPending) {
    return <div className="container mx-auto py-8">Loading settings...</div>
  }

  if (!session?.user) {
    return (
      <div className="container mx-auto py-8">
        Please sign in to view settings.
      </div>
    )
  }

  type ProviderType = "google" | "github"

  const availableProviders: AvailableProvider<ProviderType>[] = [
    {
      id: "google",
      name: "Google",
      icon: <Play className="size-5" />, // Simple placeholder for Google icon
    },
    {
      id: "github",
      name: "GitHub",
      icon: <Play className="size-5" />, // Placeholder for GitHub icon
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs
        value={view}
        onValueChange={(val) => navigate(`/settings/${val}`)}
        orientation="vertical"
        className="flex w-full flex-col gap-8 md:flex-row"
      >
        <TabsList className="h-auto w-full shrink-0 flex-col items-start justify-start bg-transparent md:w-64">
          <TabsTab value="account" className="w-full justify-start px-4 py-2">
            Account
          </TabsTab>
          <TabsTab value="security" className="w-full justify-start px-4 py-2">
            Security
          </TabsTab>
        </TabsList>
        <div className="max-w-2xl flex-1">
          <TabsPanel value="account" className="mt-0">
            <SettingsProfileForm
              user={{
                name: session.user.name || "",
                email: session.user.email,
              }}
              onUpdateProfile={async (values) => {
                await updateUser({ name: values.name })
              }}
              isPending={isUpdatingProfile}
            />

            <ChangeEmailForm
              currentEmail={session.user.email}
              onChangeEmail={async (values) => {
                await changeEmail({
                  newEmail: values.newEmail,
                  callbackURL: values.callbackURL,
                })
              }}
              isPending={isChangingEmail}
            />
          </TabsPanel>

          <TabsPanel value="security" className="mt-0">
            <ChangePasswordForm
              onChangePassword={async (values) => {
                await changePassword({
                  currentPassword: values.currentPassword || "",
                  newPassword: values.newPassword,
                  revokeOtherSessions: values.revokeOtherSessions,
                })
              }}
              isPending={isChangingPassword}
            />

            <LinkedAccountsList
              linkedAccounts={accounts}
              availableProviders={availableProviders}
              onLinkAccount={async (providerId) => {
                setPendingProviderId(providerId)
                try {
                  await linkSocial({
                    provider: providerId,
                    callbackURL: window.location.href,
                  })
                } finally {
                  setPendingProviderId(null)
                }
              }}
              onUnlinkAccount={async (providerId) => {
                setPendingProviderId(providerId)
                try {
                  await unlinkAccount({ providerId })
                } finally {
                  setPendingProviderId(null)
                }
              }}
              isPendingId={pendingProviderId}
            />

            <ActiveSessionsList
              sessions={sessions}
              currentSessionId={session.session.id}
              onRevokeSession={async (sessionId) => {
                setRevokingSessionId(sessionId)
                try {
                  await revokeSession({ token: sessionId })
                } finally {
                  setRevokingSessionId(null)
                }
              }}
              isRevokingId={revokingSessionId}
            />
          </TabsPanel>
        </div>
      </Tabs>
    </div>
  )
}
