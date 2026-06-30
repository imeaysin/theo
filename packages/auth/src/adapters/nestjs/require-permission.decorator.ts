import { SetMetadata } from "@nestjs/common"
import type { statement } from "../../permissions/platform"

export const PERMISSION_KEY = "required_permission"

type PlatformResource = keyof typeof statement
type PlatformAction<R extends PlatformResource> = (typeof statement)[R][number]

/** Platform-scoped permission (admin plugin role on `user.role` in JWT). */
export const RequirePermission = <R extends PlatformResource>(
  resource: R,
  action: PlatformAction<R>
) => SetMetadata(PERMISSION_KEY, { resource, action })
