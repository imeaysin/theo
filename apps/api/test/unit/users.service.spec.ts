import { findOrganizationMemberRole } from "@workspace/auth/nestjs"
import type { JwtClaims } from "@workspace/auth/types"
import { UsersService } from "@/modules/users/users.service"

jest.mock("@workspace/auth/nestjs", () => ({
  findOrganizationMemberRole: jest.fn(),
}))

const findOrganizationMemberRoleMock = jest.mocked(findOrganizationMemberRole)

describe("UsersService", () => {
  const service = new UsersService()

  const claims = {
    id: "user-1",
    email: "user@example.com",
    emailVerified: true,
    role: "user",
    name: "User",
    activeOrganizationId: "org-1",
    organizationRole: "member",
  } satisfies JwtClaims

  beforeEach(() => {
    findOrganizationMemberRoleMock.mockReset()
  })

  it("returns JWT claims with organization role resolved from the database", async () => {
    findOrganizationMemberRoleMock.mockResolvedValue("admin")

    await expect(service.getCurrentUserContext(claims)).resolves.toEqual({
      id: "user-1",
      email: "user@example.com",
      role: "user",
      name: "User",
      activeOrganizationId: "org-1",
      organizationRole: "admin",
    })

    expect(findOrganizationMemberRoleMock).toHaveBeenCalledWith(
      "org-1",
      "user-1"
    )
  })

  it("omits organization role lookup when no active workspace is set", async () => {
    await expect(
      service.getCurrentUserContext({ ...claims, activeOrganizationId: null })
    ).resolves.toEqual({
      id: "user-1",
      email: "user@example.com",
      role: "user",
      name: "User",
      activeOrganizationId: null,
      organizationRole: null,
    })

    expect(findOrganizationMemberRoleMock).not.toHaveBeenCalled()
  })
})
