import { z } from "zod"
import { authDb } from "../db/mongo"
import { ac as orgAc, roles as staticOrgRoles } from "./organization"

const permissionRecordSchema = z.record(z.string(), z.array(z.string()))

function authorizeStaticRole(
  roleName: string,
  resource: string,
  action: string
): boolean {
  const role = staticOrgRoles[roleName.trim() as keyof typeof staticOrgRoles]
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

  const dynamicRole = orgAc.newRole(parsed.data)
  return dynamicRole.authorize({ [resource]: [action] }).success
}

/** Sync check — static org roles only (owner, admin, member). */
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

/** Includes dynamic org roles created via `organization.createRole`. */
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
      await authorizeDynamicRole(
        organizationId,
        roleName,
        resource,
        action
      )
    ) {
      return true
    }
  }

  return false
}
