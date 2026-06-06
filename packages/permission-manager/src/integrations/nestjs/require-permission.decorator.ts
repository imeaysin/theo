import { SetMetadata, applyDecorators } from "@nestjs/common"
import { PERMISSIONS_KEY } from "./permissions-key.js"
import type { Permission } from "../../permissions/types.js"

export function RequirePermission(permission: Permission) {
  return applyDecorators(SetMetadata(PERMISSIONS_KEY, permission))
}
