import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getSessionFromHeaders } from '@repo/auth/server';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '@src/decorators/public.decorator';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest<Request>();
    const session = await getSessionFromHeaders(req.headers);

    if (!session?.user) {
      throw new UnauthorizedException('No valid session');
    }

    req.user = session.user;
    req.session = session.session;

    return true;
  }
}
