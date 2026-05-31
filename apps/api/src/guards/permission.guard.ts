import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { auth } from '@repo/auth/server';
import type { Request } from 'express';
import { PERMISSION_KEY } from '@/decorators/require-permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const meta = this.reflector.getAllAndOverride<{
      resource: string;
      action: string;
    }>(PERMISSION_KEY, [ctx.getHandler(), ctx.getClass()]);

    if (!meta) {
      return true;
    }

    const req = ctx.switchToHttp().getRequest<Request>();
    if (!req.user) {
      throw new ForbiddenException('Permission denied');
    }

    const result = await auth.api.userHasPermission({
      body: {
        userId: req.user.id,
        permissions: { [meta.resource]: [meta.action] },
      },
    });

    if (!result.success) {
      throw new ForbiddenException('Permission denied');
    }

    return true;
  }
}
