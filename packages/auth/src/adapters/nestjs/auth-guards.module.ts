import { DynamicModule, Module } from "@nestjs/common"
import { APP_GUARD, Reflector } from "@nestjs/core"
import { JwksGuard } from "./jwks.guard"
import { OrgRbacGuard } from "./org-rbac.guard"
import { RbacGuard } from "./rbac.guard"

@Module({})
export class AuthGuardsModule {
  static register(): DynamicModule {
    return {
      module: AuthGuardsModule,
      providers: [
        {
          provide: JwksGuard,
          useFactory: (reflector: Reflector) => new JwksGuard(reflector),
          inject: [Reflector],
        },
        {
          provide: RbacGuard,
          useFactory: (reflector: Reflector) => new RbacGuard(reflector),
          inject: [Reflector],
        },
        {
          provide: OrgRbacGuard,
          useFactory: (reflector: Reflector) => new OrgRbacGuard(reflector),
          inject: [Reflector],
        },
        { provide: APP_GUARD, useExisting: JwksGuard },
        { provide: APP_GUARD, useExisting: RbacGuard },
        { provide: APP_GUARD, useExisting: OrgRbacGuard },
      ],
      exports: [JwksGuard, RbacGuard, OrgRbacGuard],
    }
  }
}
