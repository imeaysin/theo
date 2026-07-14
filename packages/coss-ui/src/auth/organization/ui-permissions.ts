import type { OrganizationPermissionCheck } from "@workspace/auth/permissions/organization"

export const organizationUiPermissions = {
  deleteOrganization: { permissions: { organization: ["delete"] } },
  updateOrganization: { permissions: { organization: ["update"] } },
  updateMember: { permissions: { member: ["update"] } },
  removeMember: { permissions: { member: ["delete"] } },
  inviteMember: { permissions: { invitation: ["create"] } },
  cancelInvitation: { permissions: { invitation: ["cancel"] } },
  listRoles: { permissions: { ac: ["read"] } },
  createRole: { permissions: { ac: ["create"] } },
  updateRole: { permissions: { ac: ["update"] } },
  deleteRole: { permissions: { ac: ["delete"] } },
} as const satisfies Record<string, OrganizationPermissionCheck>
