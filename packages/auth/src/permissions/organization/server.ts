import { z } from "zod"
import { authDb } from "../../db/mongo"
import { authCollections } from "../collections"
import {
  ac,
  authorizeStaticOrganizationRole,
  type OrganizationAction,
  type OrganizationResource,
  type OrganizationStatement,
} from "./index"
import type { PermissionMapFor } from "../types"

const permissionRecordSchema = z.record(z.string(), z.array(z.string()))

async function authorizeDynamicRole<R extends OrganizationResource>(
  organizationId: string,
  roleName: string,
  resource: R,
  action: OrganizationAction<R>
): Promise<boolean> {
  const record = await authDb
    .collection(authCollections.organizationRole)
    .findOne({
      organizationId,
      role: roleName.trim(),
    })
  if (!record || typeof record.permission !== "string") return false

  const parsed = permissionRecordSchema.safeParse(JSON.parse(record.permission))
  if (!parsed.success) return false

  const dynamicRole = ac.newRole(
    parsed.data as PermissionMapFor<OrganizationStatement>
  )
  return dynamicRole.authorize({ [resource]: [action] }).success
}

export async function checkOrganizationPermissionAsync<
  R extends OrganizationResource,
>(
  organizationId: string,
  organizationRole: string | null | undefined,
  resource: R,
  action: OrganizationAction<R>
): Promise<boolean> {
  if (!organizationRole) return false

  for (const roleName of organizationRole.split(",")) {
    if (authorizeStaticOrganizationRole(roleName, resource, action)) return true
    if (
      await authorizeDynamicRole(organizationId, roleName, resource, action)
    ) {
      return true
    }
  }

  return false
}
