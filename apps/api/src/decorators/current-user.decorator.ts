import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { SessionUser } from '@repo/auth/server';
import type { Request } from 'express';

/**
 * Extract the authenticated user from the request.
 * Throws UnauthorizedException if user is not present
 * (should not happen behind global AuthGuard, but provides type safety).
 */
export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): SessionUser => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException(
        'User not found on request — ensure route is not @Public()',
      );
    }

    return user;
  },
);
