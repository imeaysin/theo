import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '@/decorators/public.decorator';

/**
 * Rejects requests from banned users.
 * Checks user.banned flag and user.banExpires for temporary bans.
 */
@Injectable()
export class BanGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest<Request>();
    const user = req.user;

    if (!user) return true; // No user = handled by AuthGuard

    if (user.banned) {
      const banExpires = user.banExpires ? new Date(user.banExpires) : null;

      // If ban has expired, allow through
      if (banExpires && banExpires < new Date()) {
        return true;
      }

      throw new ForbiddenException({
        code: 'USER_BANNED',
        message: user.banReason ?? 'Your account has been suspended',
      });
    }

    return true;
  }
}
