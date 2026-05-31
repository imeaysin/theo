import { All, Controller, Req, Res } from '@nestjs/common';
import { auth, toNodeHandler } from '@repo/auth/server';
import type { Request, Response } from 'express';
import { Public } from '@src/decorators/public.decorator';

/**
 * Proxies all /api/auth/* requests to the Better Auth node handler.
 *
 * NestJS strips the controller prefix before calling the handler, but
 * Better Auth's toNodeHandler reads req.url directly from the raw Node.js
 * request — which still contains the full path. This means Better Auth
 * sees "/api/auth/sign-in/email" and correctly matches its basePath.
 *
 * Marked @Public() so the global BetterAuthGuard does not intercept
 * Better Auth's own authentication endpoints.
 */
@Controller('auth')
@Public()
export class AuthController {
  @All('*path')
  async handleAuth(@Req() req: Request, @Res() res: Response): Promise<void> {
    const handler = toNodeHandler(auth);
    await handler(req, res);
  }
}
