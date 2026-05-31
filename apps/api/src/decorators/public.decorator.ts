import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Mark a route as public — skips the global AuthGuard.
 * Use on auth endpoints or any unauthenticated routes.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
