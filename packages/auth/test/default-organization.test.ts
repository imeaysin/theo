import type { GenericEndpointContext } from "better-auth"
import { beforeEach, describe, expect, it, vi } from "vitest"
import {
  buildDefaultOrganization,
  ensureDefaultOrganization,
  ensureSessionActiveOrganization,
} from "../src/lib/default-organization"

const mockAdapter = {
  listOrganizations: vi.fn(),
  createOrganization: vi.fn(),
  createMember: vi.fn(),
}

vi.mock("better-auth/plugins/organization", () => ({
  getOrgAdapter: vi.fn(() => mockAdapter),
}))

function createContext(
  user: { id: string; name: string } | null
): GenericEndpointContext {
  return {
    context: {
      internalAdapter: {
        findUserById: vi.fn(async (userId: string) =>
          user && userId === user.id ? user : null
        ),
      },
    },
  } as GenericEndpointContext
}

describe("buildDefaultOrganization", () => {
  it("builds a readable workspace name and stable slug", () => {
    const result = buildDefaultOrganization({
      id: "user-12345678",
      name: "Ada Lovelace",
    })

    expect(result).toEqual({
      name: "Ada Lovelace's Workspace",
      slug: "ada-lovelace-user-123",
    })
  })

  it("falls back when the user name is empty", () => {
    const result = buildDefaultOrganization({
      id: "abcdef12",
      name: "   ",
    })

    expect(result).toEqual({
      name: "My's Workspace",
      slug: "my-abcdef12",
    })
  })
})

describe("ensureDefaultOrganization", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns null when hook context is missing", async () => {
    await expect(
      ensureDefaultOrganization(null, { id: "u1", name: "User" })
    ).resolves.toBeNull()
  })

  it("returns the first existing organization without creating another", async () => {
    mockAdapter.listOrganizations.mockResolvedValueOnce([
      { id: "org-existing", name: "Existing", slug: "existing" },
    ])

    const organizationId = await ensureDefaultOrganization(
      createContext({ id: "u1", name: "User" }),
      { id: "u1", name: "User" }
    )

    expect(organizationId).toBe("org-existing")
    expect(mockAdapter.createOrganization).not.toHaveBeenCalled()
    expect(mockAdapter.createMember).not.toHaveBeenCalled()
  })

  it("creates a default workspace and owner membership for new users", async () => {
    mockAdapter.listOrganizations.mockResolvedValueOnce([])
    mockAdapter.createOrganization.mockResolvedValueOnce({
      id: "org-new",
      name: "User's Workspace",
      slug: "user-u1",
      createdAt: new Date(),
    })

    const organizationId = await ensureDefaultOrganization(
      createContext({ id: "u1", name: "User" }),
      { id: "u1", name: "User" }
    )

    expect(organizationId).toBe("org-new")
    expect(mockAdapter.createOrganization).toHaveBeenCalledWith({
      organization: expect.objectContaining({
        name: "User's Workspace",
        slug: "user-u1",
      }),
    })
    expect(mockAdapter.createMember).toHaveBeenCalledWith({
      userId: "u1",
      organizationId: "org-new",
      role: "owner",
    })
  })
})

describe("ensureSessionActiveOrganization", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("keeps sessions that already have an active organization", async () => {
    const session = {
      userId: "u1",
      activeOrganizationId: "org-1",
    }

    await expect(
      ensureSessionActiveOrganization(null, session)
    ).resolves.toEqual({ data: session })
  })

  it("sets activeOrganizationId when a default workspace is provisioned", async () => {
    mockAdapter.listOrganizations.mockResolvedValueOnce([])
    mockAdapter.createOrganization.mockResolvedValueOnce({
      id: "org-new",
      name: "User's Workspace",
      slug: "user-u1",
      createdAt: new Date(),
    })

    const session = { userId: "u1" }
    const context = createContext({ id: "u1", name: "User" })

    await expect(
      ensureSessionActiveOrganization(context, session)
    ).resolves.toEqual({
      data: {
        userId: "u1",
        activeOrganizationId: "org-new",
      },
    })
  })
})
