import { describe, expect, it } from "vitest"
import { defineAbilityFor } from "@workspace/auth/ability"
import { Roles } from "@workspace/auth/access"

describe("defineAbilityFor", () => {
  it("grants org owners manage-all", () => {
    const ability = defineAbilityFor({
      id: "u1",
      role: Roles.user,
      organizationId: "org-1",
      organizationRole: Roles.owner,
    })

    expect(ability.can("manage", "all")).toBe(true)
  })

  it("allows members to update only owned projects", () => {
    const ability = defineAbilityFor({
      id: "u1",
      role: Roles.user,
      organizationId: "org-1",
      organizationRole: Roles.member,
    })

    expect(
      ability.can("update", { __typename: "Project", ownerId: "u1" })
    ).toBe(true)
    expect(
      ability.can("update", { __typename: "Project", ownerId: "other" })
    ).toBe(false)
  })

  it("keeps viewers read-only on projects", () => {
    const ability = defineAbilityFor({
      id: "u1",
      role: Roles.user,
      organizationId: "org-1",
      organizationRole: Roles.viewer,
    })

    expect(ability.can("read", "Project")).toBe(true)
    expect(ability.can("create", "Project")).toBe(false)
    expect(ability.can("delete", "Project")).toBe(false)
  })

  it("supports comma-separated multi-role membership", () => {
    const ability = defineAbilityFor({
      id: "u1",
      role: Roles.user,
      organizationId: "org-1",
      organizationRole: `${Roles.member},${Roles.viewer}`,
    })

    expect(ability.can("create", "Project")).toBe(true)
    expect(ability.can("read", "Settings")).toBe(true)
  })
})
