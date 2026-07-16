import { Module } from "@nestjs/common"
import { NestBetterAuthModule } from "./auth.module"
import { NestCaslModule } from "./casl.module"

@Module({
  imports: [NestBetterAuthModule, NestCaslModule],
  exports: [NestBetterAuthModule, NestCaslModule],
})
export class WorkspaceAuthModule {}

export {
  AllowAnonymous,
  OptionalAuth,
  Session,
  Roles as RequireRoles,
  OrgRoles,
  UserHasPermission,
  MemberHasPermission,
  AuthService,
  AuthGuard,
  type UserSession,
} from "@thallesp/nestjs-better-auth"

export {
  AccessGuard,
  UseAbility,
  Actions,
  CaslConditions,
  CaslModule,
} from "nest-casl"

export { projectPermissions } from "./project-permissions"
export { Roles } from "../../access"
export { createAuth, type Auth } from "../auth"
