import { All, Controller, Req, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { authHandler } from '@workspace/auth/server';
import type { Request, Response } from 'express';
import { Public } from '@src/decorators/public.decorator';

@ApiExcludeController()
@Controller('auth')
@Public()
export class AuthController {
  @All('*path')
  handleAuth(@Req() req: Request, @Res() res: Response): Promise<void> {
    req.url = req.originalUrl;
    if (req.url.includes('callback') || req.url.includes('authorization')) {
      console.log(`[AUTH LOGGER] URL: ${req.method} ${req.url}`);
      console.log('[AUTH LOGGER] Headers:', JSON.stringify(req.headers, null, 2));
      console.log('[AUTH LOGGER] Query:', JSON.stringify(req.query, null, 2));
    }
    return new Promise((resolve, reject) => {
      res.once('finish', resolve);
      res.once('error', reject);
      void authHandler(req, res).catch(reject);
    });
  }
}
