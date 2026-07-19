import {
  Global,
  Injectable,
  Module,
  SetMetadata,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from "@nestjs/common"
import { APP_GUARD, Reflector } from "@nestjs/core"

const AUTH_METADATA = {
  PUBLIC: "PUBLIC",
  OPTIONAL: "OPTIONAL",
} satisfies {
  readonly PUBLIC: "PUBLIC"
  readonly OPTIONAL: "OPTIONAL"
}

type AuthMetadataKey = (typeof AUTH_METADATA)[keyof typeof AUTH_METADATA]

type RouteMetadataTargets = readonly [
  ReturnType<ExecutionContext["getHandler"]>,
  ReturnType<ExecutionContext["getClass"]>,
]

interface PermissionCheckOptions {
  readonly permissions?: Readonly<Record<string, readonly string[]>>
}

export const AllowAnonymous = () => SetMetadata(AUTH_METADATA.PUBLIC, true)
export const OptionalAuth = () => SetMetadata(AUTH_METADATA.OPTIONAL, true)
export const Session = () => () => undefined
export const RequireRoles = (_roles?: readonly string[]) => () => undefined
export const OrgRoles = (_roles?: readonly string[]) => () => undefined
export const UserHasPermission = (_options?: PermissionCheckOptions) => () =>
  undefined
export const MemberHasPermission = (_options?: PermissionCheckOptions) => () =>
  undefined

@Injectable()
class MockAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const targets: RouteMetadataTargets = [
      context.getHandler(),
      context.getClass(),
    ]

    if (this.hasMetadata(AUTH_METADATA.PUBLIC, targets)) {
      return true
    }

    if (this.hasMetadata(AUTH_METADATA.OPTIONAL, targets)) {
      return true
    }

    throw new UnauthorizedException()
  }

  private hasMetadata(
    key: AuthMetadataKey,
    targets: RouteMetadataTargets
  ): boolean {
    return this.reflector.getAllAndOverride<boolean>(key, [...targets]) === true
  }
}

interface AuthServiceApi {
  readonly getActiveMemberRole: () => Promise<{ role: string | null }>
  readonly getSession: () => Promise<null>
}

export class AuthService {
  readonly api: AuthServiceApi = {
    getActiveMemberRole: async () => ({ role: null }),
    getSession: async () => null,
  }
}

@Global()
@Module({
  providers: [AuthService, { provide: APP_GUARD, useClass: MockAuthGuard }],
  exports: [AuthService],
})
export class WorkspaceAuthModule {}

export interface UserSession {
  readonly user: {
    readonly id: string
    readonly email: string
    readonly emailVerified: boolean
    readonly name: string
    readonly role?: string | string[] | null
    readonly createdAt: Date
    readonly updatedAt: Date
  }
  readonly session: {
    readonly id: string
    readonly userId: string
    readonly expiresAt: Date
    readonly token: string
    readonly createdAt: Date
    readonly updatedAt: Date
    readonly activeOrganizationId?: string | null
  }
}
