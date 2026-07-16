export const AllowAnonymous = () => () => undefined
export const OptionalAuth = () => () => undefined
export const Session = () => () => undefined
export const RequireRoles = () => () => undefined
export const OrgRoles = () => () => undefined
export const UserHasPermission = () => () => undefined
export const MemberHasPermission = () => () => undefined

export class WorkspaceAuthModule {}

export class AuthService {
  constructor(_options?: object) {}

  api = {
    getActiveMemberRole: async () => ({ role: null as string | null }),
  }
}

export type UserSession = {
  user: {
    id: string
    email: string
    emailVerified: boolean
    name: string
    role?: string | string[] | null
    createdAt: Date
    updatedAt: Date
  }
  session: {
    id: string
    userId: string
    expiresAt: Date
    token: string
    createdAt: Date
    updatedAt: Date
    activeOrganizationId?: string | null
  }
}
