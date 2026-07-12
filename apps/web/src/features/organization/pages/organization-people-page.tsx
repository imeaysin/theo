import { useActiveOrganization } from "@workspace/auth/react"
import { Organization } from "@workspace/ui-shadcn/auth"
import { useAppOutletContext } from "@/features/auth/app-outlet-context"
import { useInviteMemberDialog } from "@/features/auth/hooks/use-invite-member-dialog"

export function OrganizationPeoplePage() {
  const { data: activeOrganization } = useActiveOrganization()
  const { openCreateOrganization } = useAppOutletContext()
  const inviteMember = useInviteMemberDialog()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">People</h2>
        <p className="text-muted-foreground">
          Manage your workspace members and invitations.
        </p>
      </div>
      <Organization
        onCreateOrganization={openCreateOrganization}
        people={
          activeOrganization
            ? {
                members: {
                  inviteDialog: inviteMember.dialogProps,
                  onInviteClick: inviteMember.openDialog,
                },
              }
            : undefined
        }
        view="people"
      />
    </div>
  )
}
