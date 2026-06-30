import { SetMetadata } from "@nestjs/common"
import type { statement } from "../../permissions/organization"

export const ORG_PERMISSION_KEY = "required_org_permission"

type OrgResource = keyof typeof statement
type OrgAction<R extends OrgResource> = (typeof statement)[R][number]

/** Organization-scoped permission (active org role from JWT). */
export const RequireOrgPermission = <R extends OrgResource>(
  resource: R,
  action: OrgAction<R>
) => SetMetadata(ORG_PERMISSION_KEY, { resource, action })
