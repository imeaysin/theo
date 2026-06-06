import { All, Controller, Req, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { authHandler } from '@repo/auth/server';
import type { Request, Response } from 'express';
import { Public } from '@src/decorators/public.decorator';

@ApiExcludeController()
@Controller('auth')
@Public()
export class AuthController {
  @All('*path')
  handleAuth(@Req() req: Request, @Res() res: Response): Promise<void> {
    req.url = req.originalUrl;
    return new Promise((resolve, reject) => {
      res.once('finish', resolve);
      res.once('error', reject);
      void authHandler(req, res).catch(reject);
    });
  }
}
