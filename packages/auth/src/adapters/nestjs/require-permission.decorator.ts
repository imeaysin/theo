import { SetMetadata } from "@nestjs/common"
import type {
  PlatformRequiredPermission,
  PlatformResource,
  PlatformAction,
} from "../../permissions/platform"

export const PERMISSION_KEY = "required_permission"

export type { PlatformRequiredPermission }

/** Platform-scoped permission (admin plugin role on `user.role` in JWT). */
export const RequirePermission = <R extends PlatformResource>(
  resource: R,
  action: PlatformAction<R>
) =>
  SetMetadata(PERMISSION_KEY, {
    resource,
    action,
  } satisfies PlatformRequiredPermission<R>)
