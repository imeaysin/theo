import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { ROLES_KEY } from '@/decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '@/decorators/public.decorator';

/**
 * Enforces role-based access control.
 * Reads @Roles(...) metadata and checks against req.user.role.
 * Skips if no @Roles() metadata is set or route is @Public().
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const req = ctx.switchToHttp().getRequest<Request>();
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    const userRole = user.role ?? 'user';
    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
