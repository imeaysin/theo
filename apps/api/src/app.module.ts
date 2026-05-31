import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { BetterAuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { BanGuard } from './guards/ban.guard';
import { EmailVerifiedGuard } from './guards/email-verified.guard';

@Module({
  imports: [AuthModule, UserModule],
  providers: [
    { provide: APP_GUARD, useClass: BetterAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: BanGuard },
    { provide: APP_GUARD, useClass: EmailVerifiedGuard },
  ],
})
export class AppModule {}
