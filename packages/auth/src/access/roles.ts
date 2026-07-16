import {
  adminAc,
  defaultStatements,
  memberAc,
  ownerAc,
} from "better-auth/plugins/organization/access"
import { createAccessControl } from "better-auth/plugins/access"

const MEMBER_ACTIONS = ["create", "read", "update", "delete"] as const

/**
 * Single source of truth for org permission vocabulary.
 * Better Auth requires this in code — dynamic roles may only use these resources/actions.
 */
export const organizationStatement = {
  ...defaultStatements,
  member: MEMBER_ACTIONS,
  project: ["create", "read", "update", "delete", "publish", "archive"],
  report: ["create", "read", "update", "delete", "export"],
  invoice: ["create", "read", "update", "delete", "approve"],
  settings: ["read", "update"],
} as const

/**
 * Resources shown in the custom-role UI.
 * Omits `organization` + `ac` so custom roles cannot grant org-delete / role-admin by default.
 */
export const rolePermissionCatalog = {
  project: organizationStatement.project,
  report: organizationStatement.report,
  invoice: organizationStatement.invoice,
  member: organizationStatement.member,
  invitation: organizationStatement.invitation,
  team: organizationStatement.team,
  settings: organizationStatement.settings,
} as const

export type OrganizationStatement = typeof organizationStatement
export type RolePermissionCatalog = typeof rolePermissionCatalog
export type PermissionResource = keyof RolePermissionCatalog

export const ac = createAccessControl(organizationStatement)

export const ownerRole = ac.newRole({
  ...ownerAc.statements,
  member: MEMBER_ACTIONS,
  project: ["create", "read", "update", "delete", "publish", "archive"],
  report: ["create", "read", "update", "delete", "export"],
  invoice: ["create", "read", "update", "delete", "approve"],
  settings: ["read", "update"],
})

export const adminRole = ac.newRole({
  ...adminAc.statements,
  member: ["create", "read", "update"],
  project: ["create", "read", "update", "delete"],
  report: ["create", "read", "update", "export"],
  invoice: ["create", "read", "update", "approve"],
  settings: ["read", "update"],
})

export const memberRole = ac.newRole({
  ...memberAc.statements,
  member: ["read"],
  project: ["create", "read", "update"],
  report: ["create", "read"],
  invoice: ["read"],
  settings: ["read"],
})

export const viewerRole = ac.newRole({
  ...memberAc.statements,
  member: ["read"],
  project: ["read"],
  report: ["read"],
  invoice: ["read"],
  settings: ["read"],
})

/** Built-in roles defined in code (not organizationRole rows). */
export const organizationRoles = {
  owner: ownerRole,
  admin: adminRole,
  member: memberRole,
  viewer: viewerRole,
} as const

export type StaticOrgRoleName = keyof typeof organizationRoles

export const STATIC_ORG_ROLES: readonly StaticOrgRoleName[] = [
  "owner",
  "admin",
  "member",
  "viewer",
]

/** Invite / assign from UI — owner is transfer-only. */
export const ASSIGNABLE_ORG_ROLES: readonly Exclude<
  StaticOrgRoleName,
  "owner"
>[] = ["admin", "member", "viewer"]

export const platformRoles = {
  admin: adminRole,
  user: memberRole,
} as const

export function isStaticOrgRole(role: string): role is StaticOrgRoleName {
  return Object.hasOwn(organizationRoles, role)
}

export function isPermissionResource(
  value: string
): value is PermissionResource {
  return Object.hasOwn(rolePermissionCatalog, value)
}
