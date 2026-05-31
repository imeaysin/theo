import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Restrict a route to specific roles.
 * Requires the global AuthGuard to have already populated req.user.
 *
 * @example @Roles('admin')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
