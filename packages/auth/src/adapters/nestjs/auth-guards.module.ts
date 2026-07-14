import { DynamicModule, Module } from "@nestjs/common"
import { APP_GUARD, Reflector } from "@nestjs/core"
import { OrgRbacGuard } from "./org-rbac.guard"
import { RbacGuard } from "./rbac.guard"

/**
 * Guards are bundled with tsup/esbuild, which does not emit `design:paramtypes`
 * metadata. `useFactory` wires Reflector explicitly (Nest APP_GUARD pattern).
 */
@Module({})
export class AuthGuardsModule {
  static register(): DynamicModule {
    return {
      module: AuthGuardsModule,
      providers: [
        {
          provide: APP_GUARD,
          useFactory: (reflector: Reflector) => new RbacGuard(reflector),
          inject: [Reflector],
        },
        {
          provide: APP_GUARD,
          useFactory: (reflector: Reflector) => new OrgRbacGuard(reflector),
          inject: [Reflector],
        },
      ],
    }
  }
}
