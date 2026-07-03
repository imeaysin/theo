import { useActiveOrganization } from "@workspace/auth/react"
import { Organization } from "@workspace/ui/auth"
import { ShellMain } from "@workspace/ui/components/shell"
import { useAppOutletContext } from "@/features/auth/app-outlet-context"
import { useInviteMemberDialog } from "@/features/auth/hooks/use-invite-member-dialog"

export function OrganizationPeoplePage() {
  const { data: activeOrganization } = useActiveOrganization()
  const { openCreateOrganization } = useAppOutletContext()
  const inviteMember = useInviteMemberDialog()

  return (
    <ShellMain
      header={{
        heading: "Workspace",
        subtitle: "Manage your workspace settings and members.",
      }}
    >
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
    </ShellMain>
  )
}
