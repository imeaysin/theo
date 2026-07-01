import { describe, expect, it } from "vitest"
import {
  buildOrganizationSlug,
  buildOrganizationSlugBase,
  buildOrganizationSlugCandidates,
  resolveAvailableOrganizationSlug,
  sanitizeOrganizationSlug,
} from "../src/lib/organization-slug"
import {
  isOrganizationSlugAvailable,
  isOrganizationSlugTakenError,
} from "../src/lib/organization-slug-availability"

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

describe("buildOrganizationSlugCandidates", () => {
  it("returns unique candidates with stable and fallback suffixes", () => {
    const candidates = buildOrganizationSlugCandidates(
      "ABCD",
      "user-12345678",
      3
    )

    expect(candidates[0]).toBe("abcd-user-123")
    expect(candidates).toContain("abcd-user-123-2")
    expect(candidates).toContain("abcd-user-123-3")
    expect(new Set(candidates).size).toBe(candidates.length)
  })
})

describe("resolveAvailableOrganizationSlug", () => {
  it("returns the first available candidate", async () => {
    const taken = new Set(["abcd-user-123"])
    const slug = await resolveAvailableOrganizationSlug(
      "ABCD",
      "user-12345678",
      async (candidate) => !taken.has(candidate)
    )

    expect(slug).toBe("abcd-user-123-2")
  })

  it("falls back to a random suffix when all candidates are taken", async () => {
    const slug = await resolveAvailableOrganizationSlug(
      "ABCD",
      "user-12345678",
      async () => false
    )

    expect(slug.startsWith("abcd-user-123-")).toBe(true)
    expect(slug).not.toBe("abcd-user-123")
  })
})

describe("organization slug availability helpers", () => {
  it("detects slug-taken error codes", () => {
    expect(
      isOrganizationSlugTakenError({
        code: "ORGANIZATION_SLUG_ALREADY_TAKEN",
      })
    ).toBe(true)
    expect(isOrganizationSlugTakenError({ code: "NETWORK_ERROR" })).toBe(false)
  })

  it("reads availability results", () => {
    expect(isOrganizationSlugAvailable({ available: true })).toBe(true)
    expect(isOrganizationSlugAvailable({ available: false })).toBe(false)
    expect(isOrganizationSlugAvailable(null)).toBe(false)
  })
})

describe("buildOrganizationSlugBase", () => {
  it("falls back to workspace for empty names", () => {
    expect(buildOrganizationSlugBase("!!!")).toBe("workspace")
  })
})
