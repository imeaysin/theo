import type { UserSession } from "@workspace/auth/nestjs"
import { UsersService } from "@/modules/users/users.service"

describe("UsersService", () => {
  const getActiveMemberRole = jest.fn()
  const service = new UsersService({
    api: { getActiveMemberRole },
  })
  const headers = new Headers()

  const session = {
    user: {
      id: "user-1",
      email: "user@example.com",
      emailVerified: true,
      name: "User",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    session: {
      id: "session-1",
      userId: "user-1",
      expiresAt: new Date(),
      token: "token",
      createdAt: new Date(),
      updatedAt: new Date(),
      activeOrganizationId: "org-1",
    },
  } satisfies UserSession

  beforeEach(() => {
    getActiveMemberRole.mockReset()
  })

  it("returns session user context with organization role", async () => {
    getActiveMemberRole.mockResolvedValue({ role: "owner" })

    await expect(
      service.getCurrentUserContext({ session, headers })
    ).resolves.toEqual({
      id: "user-1",
      email: "user@example.com",
      role: "user",
      name: "User",
      activeOrganizationId: "org-1",
      organizationRole: "owner",
    })
  })

  it("omits organization role when no active workspace is set", async () => {
    await expect(
      service.getCurrentUserContext({
        session: {
          ...session,
          session: { ...session.session, activeOrganizationId: undefined },
        },
        headers,
      })
    ).resolves.toEqual({
      id: "user-1",
      email: "user@example.com",
      role: "user",
      name: "User",
      activeOrganizationId: null,
      organizationRole: null,
    })

    expect(getActiveMemberRole).not.toHaveBeenCalled()
  })
})
