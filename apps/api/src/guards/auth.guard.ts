import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getAuthFromHeaders } from '@workspace/auth/server';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '@src/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest<Request>();
    const auth = await getAuthFromHeaders(req.headers);

    if (!auth?.user) {
      throw new UnauthorizedException('Invalid or missing access token');
    }

    req.user = auth.user;

    return true;
  }
}
