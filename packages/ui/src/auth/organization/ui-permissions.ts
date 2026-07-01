import type { OrganizationPermissionCheck } from "@workspace/auth/react"

export const organizationUiPermissions = {
  deleteOrganization: { permissions: { organization: ["delete"] } },
  updateOrganization: { permissions: { organization: ["update"] } },
  updateMember: { permissions: { member: ["update"] } },
  removeMember: { permissions: { member: ["delete"] } },
  inviteMember: { permissions: { invitation: ["create"] } },
  cancelInvitation: { permissions: { invitation: ["cancel"] } },
} as const satisfies Record<string, OrganizationPermissionCheck>
