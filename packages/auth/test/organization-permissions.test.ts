import { describe, expect, it } from "vitest"
import {
  canAssignOrganizationRole,
  checkOrganizationPermission,
  formatOrganizationRoleLabel,
  parseOrganizationRoles,
} from "../src/permissions/organization"

describe("checkOrganizationPermission", () => {
  it("grants owners full organization management", () => {
    expect(checkOrganizationPermission("owner", "organization", "delete")).toBe(
      true
    )
    expect(checkOrganizationPermission("owner", "member", "update")).toBe(true)
    expect(checkOrganizationPermission("owner", "invitation", "create")).toBe(
      true
    )
  })

  it("limits members to read-oriented actions", () => {
    expect(checkOrganizationPermission("member", "member", "update")).toBe(
      false
    )
    expect(checkOrganizationPermission("member", "invitation", "create")).toBe(
      false
    )
    expect(checkOrganizationPermission("member", "project", "read")).toBe(true)
  })

  it("allows admins to invite but not delete the workspace", () => {
    expect(checkOrganizationPermission("admin", "invitation", "create")).toBe(
      true
    )
    expect(checkOrganizationPermission("admin", "organization", "delete")).toBe(
      false
    )
  })

  it("supports comma-separated role strings", () => {
    expect(
      checkOrganizationPermission("member,admin", "invitation", "create")
    ).toBe(true)
  })

  it("denies access when no organization role is present", () => {
    expect(checkOrganizationPermission(null, "project", "read")).toBe(false)
  })
})

describe("canAssignOrganizationRole", () => {
  it("only lets owners assign the owner role", () => {
    expect(canAssignOrganizationRole("owner", "owner")).toBe(true)
    expect(canAssignOrganizationRole("admin", "owner")).toBe(false)
    expect(canAssignOrganizationRole("member", "owner")).toBe(false)
  })

  it("allows non-owner role assignment for any assigner", () => {
    expect(canAssignOrganizationRole("admin", "member")).toBe(true)
    expect(canAssignOrganizationRole("member", "member")).toBe(true)
  })
})

describe("role formatting helpers", () => {
  it("parses and formats comma-separated roles", () => {
    expect(parseOrganizationRoles("owner,admin")).toEqual(["owner", "admin"])
    expect(formatOrganizationRoleLabel("owner,admin")).toBe("Owner, Admin")
  })
})
