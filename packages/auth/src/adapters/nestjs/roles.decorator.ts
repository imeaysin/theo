import { SetMetadata } from "@nestjs/common"
import type { PlatformRoleName } from "../../types/auth"

export const ROLES_KEY = "platform_roles"

export const Roles = (...roles: PlatformRoleName[]) =>
  SetMetadata(ROLES_KEY, roles)
