import { z } from "zod"
import { findOrganizationMemberRole } from "../../lib/organization-role"
import { getAuthDb, ensureAuthMongoConnected, toMongoId } from "../../db/mongo"
import { authCollections } from "../collections"
import {
  ac,
  authorizeStaticOrganizationRole,
  isOrganizationResource,
  type OrganizationAction,
  type OrganizationRequiredPermission,
  type OrganizationResource,
  type OrganizationStatement,
} from "./index"
import type { PermissionMapFor } from "../types"

export type OrganizationMemberScope = {
  organizationId: string
  userId: string
}

const permissionRecordSchema = z.record(z.string(), z.array(z.string()))

async function authorizeDynamicRole<R extends OrganizationResource>(params: {
  organizationId: string
  roleName: string
  resource: R
  action: OrganizationAction<R>
}): Promise<boolean> {
  await ensureAuthMongoConnected()

  const record = await getAuthDb()
    .collection(authCollections.organizationRole)
    .findOne({
      organizationId: toMongoId(params.organizationId),
      role: params.roleName.trim(),
    })
  if (!record || typeof record.permission !== "string") return false

  const parsed = permissionRecordSchema.safeParse(JSON.parse(record.permission))
  if (!parsed.success) return false

  const dynamicPermissions = Object.entries(parsed.data).reduce<
    PermissionMapFor<OrganizationStatement>
  >((acc, [resource, actions]) => {
    if (!isOrganizationResource(resource)) return acc
    return { ...acc, [resource]: actions }
  }, {})

  const dynamicRole = ac.newRole(dynamicPermissions)
  return dynamicRole.authorize({ [params.resource]: [params.action] }).success
}

export async function checkOrganizationPermissionAsync<
  R extends OrganizationResource,
>(params: {
  organizationId: string
  role: string | null | undefined
  resource: R
  action: OrganizationAction<R>
}): Promise<boolean> {
  if (!params.role) return false

  for (const roleName of params.role.split(",")) {
    if (
      authorizeStaticOrganizationRole(roleName, params.resource, params.action)
    )
      return true
    if (
      await authorizeDynamicRole({
        organizationId: params.organizationId,
        roleName,
        resource: params.resource,
        action: params.action,
      })
    ) {
      return true
    }
  }

  return false
}

/** Resolves the member role from the database — do not rely on JWT `organizationRole`. */
export async function checkMemberOrganizationPermission<
  R extends OrganizationResource,
>(
  member: OrganizationMemberScope,
  permission: OrganizationRequiredPermission<R>
): Promise<boolean> {
  const organizationRole = await findOrganizationMemberRole(
    member.organizationId,
    member.userId
  )

  return checkOrganizationPermissionAsync({
    organizationId: member.organizationId,
    role: organizationRole,
    resource: permission.resource,
    action: permission.action,
  })
}
