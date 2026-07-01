import { createAccessControl } from "better-auth/plugins/access"
import {
  defaultStatements as orgDefaultStatements,
  ownerAc,
  adminAc,
  memberAc,
} from "better-auth/plugins/organization/access"
import { z } from "zod"
import { authDb } from "../db/mongo"

export const statement = {
  ...orgDefaultStatements,
  project: [
    "create",
    "read",
    "update",
    "delete",
    "publish",
    "archive",
  ] as const,
  content: ["create", "read", "update", "delete", "publish"] as const,
  billing: ["read", "manage"] as const,
  analytics: ["read", "export"] as const,
  settings: ["read", "update"] as const,
} as const

export const ac = createAccessControl(statement)

export const ownerRole = ac.newRole({
  ...ownerAc.statements,
  project: ["create", "read", "update", "delete", "publish", "archive"],
  content: ["create", "read", "update", "delete", "publish"],
  billing: ["read", "manage"],
  analytics: ["read", "export"],
  settings: ["read", "update"],
})

export const adminRole = ac.newRole({
  ...adminAc.statements,
  project: ["create", "read", "update", "delete", "publish"],
  content: ["create", "read", "update", "delete", "publish"],
  billing: ["read"],
  analytics: ["read", "export"],
  settings: ["read", "update"],
})

export const memberRole = ac.newRole({
  ...memberAc.statements,
  project: ["create", "read", "update"],
  content: ["create", "read", "update"],
  analytics: ["read"],
  settings: ["read"],
})

export const organizationRoles = {
  owner: ownerRole,
  admin: adminRole,
  member: memberRole,
} as const

export const roles = organizationRoles

const permissionRecordSchema = z.record(z.string(), z.array(z.string()))

function authorizeStaticRole(
  roleName: string,
  resource: string,
  action: string
): boolean {
  const role =
    organizationRoles[roleName.trim() as keyof typeof organizationRoles]
  return role?.authorize({ [resource]: [action] }).success ?? false
}

async function authorizeDynamicRole(
  organizationId: string,
  roleName: string,
  resource: string,
  action: string
): Promise<boolean> {
  const record = await authDb.collection("organizationRole").findOne({
    organizationId,
    role: roleName.trim(),
  })
  if (!record || typeof record.permission !== "string") return false

  const parsed = permissionRecordSchema.safeParse(JSON.parse(record.permission))
  if (!parsed.success) return false

  const dynamicRole = ac.newRole(parsed.data)
  return dynamicRole.authorize({ [resource]: [action] }).success
}

export function checkOrganizationPermission(
  organizationRole: string | null | undefined,
  resource: string,
  action: string
): boolean {
  if (!organizationRole) return false

  return organizationRole
    .split(",")
    .some((roleName) => authorizeStaticRole(roleName, resource, action))
}

export async function checkOrganizationPermissionAsync(
  organizationId: string,
  organizationRole: string | null | undefined,
  resource: string,
  action: string
): Promise<boolean> {
  if (!organizationRole) return false

  for (const roleName of organizationRole.split(",")) {
    if (authorizeStaticRole(roleName, resource, action)) return true
    if (
      await authorizeDynamicRole(organizationId, roleName, resource, action)
    ) {
      return true
    }
  }

  return false
}
