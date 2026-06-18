import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { hasPermission, type Permission } from '@workspace/auth/access-control';
import type { Request } from 'express';
import { PERMISSIONS_KEY } from '@src/decorators/require-permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<
      Permission | undefined
    >(PERMISSIONS_KEY, [ctx.getHandler(), ctx.getClass()]);

    if (!requiredPermission) return true;

    const req = ctx.switchToHttp().getRequest<Request>();
    const role = req.user?.role;

    if (!role) throw new ForbiddenException('No role assigned');

    if (!hasPermission(role, requiredPermission)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
