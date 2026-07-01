import type { GenericEndpointContext } from "better-auth"
import { beforeEach, describe, expect, it, vi } from "vitest"
import {
  buildOrganizationSlug,
  ensureSessionActiveOrganization,
  sanitizeOrganizationSlug,
} from "../src/lib/default-organization"

const mockAdapter = {
  listOrganizations: vi.fn(),
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

describe("sanitizeOrganizationSlug", () => {
  it("normalizes names into URL-safe slugs", () => {
    expect(sanitizeOrganizationSlug("Acme Inc.")).toBe("acme-inc")
  })
})

describe("buildOrganizationSlug", () => {
  it("appends a stable user suffix", () => {
    expect(buildOrganizationSlug("Ada Lovelace", "user-12345678")).toBe(
      "ada-lovelace-user-123"
    )
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

  it("sets activeOrganizationId from the first existing workspace", async () => {
    mockAdapter.listOrganizations.mockResolvedValueOnce([
      { id: "org-existing", name: "Existing", slug: "existing" },
    ])

    const session = { userId: "u1" }
    const context = createContext({ id: "u1", name: "User" })

    await expect(
      ensureSessionActiveOrganization(context, session)
    ).resolves.toEqual({
      data: {
        userId: "u1",
        activeOrganizationId: "org-existing",
      },
    })
  })

  it("does not create a workspace when the user has none", async () => {
    mockAdapter.listOrganizations.mockResolvedValueOnce([])

    const session = { userId: "u1" }
    const context = createContext({ id: "u1", name: "User" })

    await expect(
      ensureSessionActiveOrganization(context, session)
    ).resolves.toEqual({ data: session })
  })
})
