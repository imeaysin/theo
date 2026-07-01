import { SetMetadata } from "@nestjs/common"
import type {
  OrganizationRequiredPermission,
  OrganizationResource,
  OrganizationAction,
} from "../../permissions/organization"

export const ORG_PERMISSION_KEY = "required_org_permission"

export type { OrganizationRequiredPermission }

/** Organization-scoped permission (active org role from JWT). */
export const RequireOrgPermission = <R extends OrganizationResource>(
  resource: R,
  action: OrganizationAction<R>
) =>
  SetMetadata(ORG_PERMISSION_KEY, {
    resource,
    action,
  } satisfies OrganizationRequiredPermission<R>)
