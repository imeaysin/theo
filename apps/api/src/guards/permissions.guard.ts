import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '@repo/permission-manager/nestjs';
import { hasPermission } from '@repo/permission-manager';
import type { Permission } from '@repo/permission-manager/nestjs';
import type { Request } from 'express';

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
