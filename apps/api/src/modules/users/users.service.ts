import { Inject, Injectable } from "@nestjs/common"
import { AuthService, type UserSession } from "@workspace/auth/nestjs"
import { MeResponseSchema, type MeResponse } from "@workspace/contracts"

const DEFAULT_PLATFORM_ROLE = "user" as const

type CurrentUserContextInput = {
  readonly session: UserSession
  readonly headers: Headers
}

type ActiveMemberRoleResult = {
  readonly role?: string
}

type ActiveMemberRoleApi = {
  getActiveMemberRole: (input: {
    headers: Headers
  }) => Promise<ActiveMemberRoleResult>
}

type AuthApiHost = {
  readonly api: object
}

@Injectable()
export class UsersService {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthApiHost
  ) {}

  async getCurrentUserContext(
    input: CurrentUserContextInput
  ): Promise<MeResponse> {
    const { session, headers } = input
    const activeOrganizationId = session.session.activeOrganizationId ?? null

    return MeResponseSchema.parse({
      id: session.user.id,
      email: session.user.email,
      role: resolvePlatformRole(session.user.role),
      name: session.user.name,
      activeOrganizationId,
      organizationRole: activeOrganizationId
        ? await this.resolveOrganizationRole(headers)
        : null,
    })
  }

  private async resolveOrganizationRole(
    headers: Headers
  ): Promise<string | null> {
    if (!hasActiveMemberRoleApi(this.authService.api)) {
      return null
    }

    const result = await this.authService.api.getActiveMemberRole({ headers })
    return result.role ?? null
  }
}

function hasActiveMemberRoleApi(api: object): api is ActiveMemberRoleApi {
  return typeof Reflect.get(api, "getActiveMemberRole") === "function"
}

function resolvePlatformRole(
  roleValue: string | string[] | null | undefined
): string {
  if (Array.isArray(roleValue)) {
    return roleValue[0] ?? DEFAULT_PLATFORM_ROLE
  }
  return roleValue ?? DEFAULT_PLATFORM_ROLE
}
