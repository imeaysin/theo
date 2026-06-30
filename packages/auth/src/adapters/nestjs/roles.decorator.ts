import { SetMetadata } from "@nestjs/common"
import type { RoleName } from "../../types/auth.types"

export const ROLES_KEY = "platform_roles"

/** Coarse platform role check (admin plugin role on `user.role` in JWT). Prefer `@RequirePermission` when a specific action exists. */
export const Roles = (...roles: RoleName[]) => SetMetadata(ROLES_KEY, roles)
