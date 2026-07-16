import { useQueryClient } from "@tanstack/react-query"
import { authClient, useSession } from "@workspace/auth/client"
import { Button } from "@workspace/ui-shadcn/components/button"
import { Skeleton } from "@workspace/ui-shadcn/components/skeleton"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui-shadcn/components/tabs"
import { PlusIcon, UserPlusIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { AssignRoleDialog } from "@/features/workspace/components/assign-role-dialog"
import { InviteMemberDialog } from "@/features/workspace/components/invite-member-dialog"
import { InvitationsPanel } from "@/features/workspace/components/invitations-panel"
import { MembersPanel } from "@/features/workspace/components/members-panel"
import { RoleFormDialog } from "@/features/workspace/components/role-form-dialog"
import { RolesPanel } from "@/features/workspace/components/roles-panel"
import {
  WorkspaceConfirmDialog,
  type WorkspaceConfirmAction,
} from "@/features/workspace/components/workspace-confirm-dialog"
import { WorkspaceOverview } from "@/features/workspace/components/workspace-overview"
import {
  useWorkspaceOrganization,
  useWorkspaceRoles,
  workspaceRolesKey,
  type WorkspaceInvitation,
  type WorkspaceMember,
  type WorkspaceRole,
} from "@/features/workspace/hooks/use-workspace"
import { useWorkspacePermissions } from "@/features/workspace/hooks/use-workspace-permissions"
import { ASSIGNABLE_ORG_ROLES } from "@/features/workspace/lib/org-roles"

export function WorkspacePage() {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const {
    data: organization,
    isPending: orgPending,
    refetch: refetchOrg,
  } = useWorkspaceOrganization()
  const permissions = useWorkspacePermissions(organization?.id)
  const rolesQuery = useWorkspaceRoles(
    permissions.canListRoles ? organization?.id : null
  )

  const [inviteOpen, setInviteOpen] = useState(false)
  const [roleFormOpen, setRoleFormOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<WorkspaceRole | null>(null)
  const [assignMember, setAssignMember] = useState<WorkspaceMember | null>(null)
  const [confirm, setConfirm] = useState<WorkspaceConfirmAction | null>(null)

  const members: WorkspaceMember[] = organization?.members ?? []
  const invitations: WorkspaceInvitation[] = organization?.invitations ?? []
  const roleOptions = useMemo(() => {
    const custom = rolesQuery.data ?? []
    return [...ASSIGNABLE_ORG_ROLES, ...custom.map((role) => role.role)]
  }, [rolesQuery.data])
  const customRoles = rolesQuery.data ?? []

  async function refreshWorkspace() {
    await refetchOrg()
    if (!organization?.id) return
    await queryClient.invalidateQueries({
      queryKey: workspaceRolesKey(organization.id),
    })
  }

  async function runConfirm() {
    if (!confirm) return
    if (confirm.type === "remove-member") {
      const result = await authClient.organization.removeMember({
        memberIdOrEmail: confirm.member.id,
      })
      if (result.error) {
        toast.error(result.error.message ?? "Could not remove member")
        return
      }
      toast.success(`Removed ${confirm.member.user.name}`)
    } else if (confirm.type === "cancel-invite") {
      const result = await authClient.organization.cancelInvitation({
        invitationId: confirm.invite.id,
      })
      if (result.error) {
        toast.error(result.error.message ?? "Could not cancel invitation")
        return
      }
      toast.success(`Cancelled invite to ${confirm.invite.email}`)
    } else {
      const result = await authClient.organization.deleteRole({
        roleId: confirm.role.id,
      })
      if (result.error) {
        toast.error(result.error.message ?? "Could not delete role")
        return
      }
      toast.success(`Deleted role ${confirm.role.role}`)
    }
    setConfirm(null)
    await refreshWorkspace()
  }

  if (orgPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">Workspace</h2>
        <p className="text-muted-foreground">
          Select or create a workspace from the sidebar to manage members and
          roles.
        </p>
      </div>
    )
  }

  const pendingInvites = invitations.filter(
    (invite) => invite.status.toLowerCase() === "pending"
  ).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight">
            {organization.name}
          </h2>
          <p className="text-muted-foreground">
            Manage workspace settings, members, invitations, and roles.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {permissions.canInvite ? (
            <Button onClick={() => setInviteOpen(true)} type="button">
              <UserPlusIcon data-icon="inline-start" />
              Invite
            </Button>
          ) : null}
          {permissions.canCreateRoles ? (
            <Button
              onClick={() => {
                setEditingRole(null)
                setRoleFormOpen(true)
              }}
              type="button"
              variant="outline"
            >
              <PlusIcon data-icon="inline-start" />
              New role
            </Button>
          ) : null}
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>
        <TabsContent className="pt-4" value="overview">
          <WorkspaceOverview
            canUpdate={permissions.canUpdateSettings}
            invitationCount={pendingInvites}
            memberCount={members.length}
            name={organization.name}
            organizationId={organization.id}
            slug={organization.slug}
            onUpdated={() => void refreshWorkspace()}
          />
        </TabsContent>
        <TabsContent className="pt-4" value="members">
          <MembersPanel
            canAssignRoles={permissions.canAssignRoles}
            canRemoveMembers={permissions.canRemoveMembers}
            currentUserId={session?.user.id ?? ""}
            members={members}
            onAssignRole={setAssignMember}
            onRemoveMember={(member) =>
              setConfirm({ type: "remove-member", member })
            }
          />
        </TabsContent>
        <TabsContent className="pt-4" value="invitations">
          <InvitationsPanel
            canManageInvites={permissions.canCancelInvites}
            invitations={invitations}
            onCancel={(invite) => setConfirm({ type: "cancel-invite", invite })}
          />
        </TabsContent>
        <TabsContent className="pt-4" value="roles">
          {permissions.canListRoles ? (
            <RolesPanel
              canDeleteRoles={permissions.canDeleteRoles}
              canUpdateRoles={permissions.canUpdateRoles}
              customRoles={customRoles}
              onDelete={(role) => setConfirm({ type: "delete-role", role })}
              onEdit={(role) => {
                setEditingRole(role)
                setRoleFormOpen(true)
              }}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              You do not have permission to view custom roles in this workspace.
            </p>
          )}
        </TabsContent>
      </Tabs>

      <InviteMemberDialog
        onInvited={() => void refreshWorkspace()}
        onOpenChange={setInviteOpen}
        open={inviteOpen}
        roleOptions={roleOptions}
      />
      <AssignRoleDialog
        member={assignMember}
        onAssigned={() => void refreshWorkspace()}
        onOpenChange={(open) => {
          if (!open) setAssignMember(null)
        }}
        open={Boolean(assignMember)}
        roleOptions={roleOptions}
      />
      <RoleFormDialog
        editingRole={editingRole}
        onOpenChange={(open) => {
          setRoleFormOpen(open)
          if (!open) setEditingRole(null)
        }}
        onSaved={() => void refreshWorkspace()}
        open={roleFormOpen}
      />
      <WorkspaceConfirmDialog
        action={confirm}
        onConfirm={() => void runConfirm()}
        onOpenChange={(open) => {
          if (!open) setConfirm(null)
        }}
      />
    </div>
  )
}
