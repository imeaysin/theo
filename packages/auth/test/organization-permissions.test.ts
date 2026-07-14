import { describe, expect, it } from "vitest"
import {
  canAssignOrganizationRole,
  checkOrganizationPermission,
  checkOrganizationPermissionMap,
  formatOrganizationRoleLabel,
  getOrganizationRoleNames,
  parseOrganizationRoles,
  resolveAssignableOrganizationRoles,
} from "../src/permissions/organization"

describe("checkOrganizationPermission", () => {
  it("grants billing role access to billing but not members", () => {
    expect(
      checkOrganizationPermission({
        role: "billing",
        resource: "billing",
        action: "read",
      })
    ).toBe(true)
    expect(
      checkOrganizationPermission({
        role: "billing",
        resource: "billing",
        action: "manage",
      })
    ).toBe(true)
    expect(
      checkOrganizationPermission({
        role: "billing",
        resource: "member",
        action: "update",
      })
    ).toBe(false)
  })

  it("handles messy role strings with spaces and empty segments", () => {
    expect(
      checkOrganizationPermission({
        role: "member,admin",
        resource: "invitation",
        action: "create",
      })
    ).toBe(true)
    expect(
      checkOrganizationPermission({
        role: "billing,member",
        resource: "project",
        action: "update",
      })
    ).toBe(true)
    expect(
      checkOrganizationPermission({
        role: " ,, owner, ",
        resource: "organization",
        action: "delete",
      })
    ).toBe(true)
    expect(
      checkOrganizationPermission({
        role: " admin , billing ",
        resource: "billing",
        action: "manage",
      })
    ).toBe(true)
  })

  it("ignores invalid or unknown static roles in a comma-separated list", () => {
    // superhacker doesn't exist, but admin does
    // @ts-expect-error
    expect(
      checkOrganizationPermission({
        role: "superhacker",
        resource: "project",
        action: "read",
      })
    ).toBe(false)
    // @ts-expect-error
    expect(
      checkOrganizationPermission({
        role: "admin,superhacker",
        resource: "project",
        action: "read",
      })
    ).toBe(true)
  })

  it("grants owners full organization management", () => {
    expect(
      checkOrganizationPermission({
        role: "owner",
        resource: "organization",
        action: "delete",
      })
    ).toBe(true)
    expect(
      checkOrganizationPermission({
        role: "owner",
        resource: "member",
        action: "update",
      })
    ).toBe(true)
    expect(
      checkOrganizationPermission({
        role: "owner",
        resource: "invitation",
        action: "create",
      })
    ).toBe(true)
  })

  it("limits members to read-oriented actions", () => {
    expect(
      checkOrganizationPermission({
        role: "member",
        resource: "member",
        action: "update",
      })
    ).toBe(false)
    expect(
      checkOrganizationPermission({
        role: "member",
        resource: "invitation",
        action: "create",
      })
    ).toBe(false)
    expect(
      checkOrganizationPermission({
        role: "member",
        resource: "project",
        action: "read",
      })
    ).toBe(true)
  })

  it("allows admins to invite but not delete the workspace", () => {
    expect(
      checkOrganizationPermission({
        role: "admin",
        resource: "invitation",
        action: "create",
      })
    ).toBe(true)
    expect(
      checkOrganizationPermission({
        role: "admin",
        resource: "organization",
        action: "delete",
      })
    ).toBe(false)
  })

  it("denies access when no organization role is present", () => {
    expect(
      checkOrganizationPermission({
        role: null,
        resource: "project",
        action: "read",
      })
    ).toBe(false)
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

describe("getOrganizationRoleNames", () => {
  it("always includes built-in roles and merges dynamic roles", () => {
    expect(getOrganizationRoleNames()).toEqual([
      "owner",
      "admin",
      "member",
      "billing",
    ])
    expect(getOrganizationRoleNames([])).toEqual([
      "owner",
      "admin",
      "member",
      "billing",
    ])
    expect(getOrganizationRoleNames([{ role: "moderator" }])).toEqual([
      "owner",
      "admin",
      "member",
      "billing",
      "moderator",
    ])
  })
})

describe("checkOrganizationPermissionMap", () => {
  it("checks every action in a permission map", () => {
    expect(
      checkOrganizationPermissionMap("owner", {
        invitation: ["create"],
        member: ["update"],
      })
    ).toBe(true)
    expect(
      checkOrganizationPermissionMap("member", {
        invitation: ["create"],
      })
    ).toBe(false)
  })
})

describe("resolveAssignableOrganizationRoles", () => {
  it("returns built-in roles for owners who can invite", () => {
    expect(
      resolveAssignableOrganizationRoles({
        canAssignRoles: true,
        activeMemberRole: "owner",
        dynamicRoles: [],
      })
    ).toEqual(["owner", "admin", "member", "billing"])
  })

  it("does not require dynamic roles from list-roles", () => {
    expect(
      resolveAssignableOrganizationRoles({
        canAssignRoles: true,
        activeMemberRole: "owner",
        dynamicRoles: undefined,
      })
    ).toEqual(["owner", "admin", "member", "billing"])
  })

  it("returns no roles when the user cannot assign", () => {
    expect(
      resolveAssignableOrganizationRoles({
        canAssignRoles: false,
        activeMemberRole: "owner",
      })
    ).toEqual([])
  })

  it("prevents non-owners from assigning the owner role", () => {
    expect(
      resolveAssignableOrganizationRoles({
        canAssignRoles: true,
        activeMemberRole: "admin",
      })
    ).toEqual(["admin", "member", "billing"])
  })

  it("merges custom dynamic roles", () => {
    expect(
      resolveAssignableOrganizationRoles({
        canAssignRoles: true,
        activeMemberRole: "owner",
        dynamicRoles: [{ role: "moderator" }],
      })
    ).toEqual(["owner", "admin", "member", "billing", "moderator"])
  })
})

describe("role formatting helpers", () => {
  it("parses and formats comma-separated roles", () => {
    expect(parseOrganizationRoles("owner,admin")).toEqual(["owner", "admin"])
    expect(formatOrganizationRoleLabel("owner,admin")).toBe("Owner, Admin")
  })
})
