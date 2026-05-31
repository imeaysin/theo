import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { SessionData } from '@repo/auth/server';
import type { Request } from 'express';

/**
 * Extract the raw session object (token, expiresAt, etc.) from the request.
 */
export const CurrentSession = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): SessionData | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.session;
  },
);
