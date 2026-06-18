import { SetMetadata, applyDecorators } from '@nestjs/common';
import type { Permission } from '@workspace/auth/access-control';

export const PERMISSIONS_KEY = 'auth:permissions';

export function RequirePermission(permission: Permission) {
  return applyDecorators(SetMetadata(PERMISSIONS_KEY, permission));
}
