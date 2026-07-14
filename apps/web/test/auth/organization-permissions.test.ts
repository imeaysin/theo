import { describe, expect, it } from "vitest"
import { checkOrganizationPermission } from "@workspace/auth/permissions/organization"
import { organizationUiPermissions } from "../../../../packages/coss-ui/src/auth/organization/ui-permissions"
import { checkOrganizationPermissionMap } from "@workspace/auth/permissions/organization"

describe("organizationUiPermissions", () => {
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
    expect(
      checkOrganizationPermission({
        role: "superhacker",
        resource: "project",
        action: "read",
      })
    ).toBe(false)
    expect(
      checkOrganizationPermission({
        role: "admin,superhacker",
        resource: "project",
        action: "read",
      })
    ).toBe(true)
  })

  it("maps UI actions to permissions owners are granted", () => {
    const checks = Object.values(organizationUiPermissions)
    for (const check of checks) {
      expect(
        checkOrganizationPermissionMap("owner", check.permissions),
        "owner should be granted all UI permissions"
      ).toBe(true)
    }
  })

  it("hides destructive and invite actions from members", () => {
    expect(
      checkOrganizationPermission({
        role: "member",
        resource: "organization",
        action:
          organizationUiPermissions.deleteOrganization.permissions
            .organization[0],
      })
    ).toBe(false)
    expect(
      checkOrganizationPermission({
        role: "member",
        resource: "invitation",
        action:
          organizationUiPermissions.inviteMember.permissions.invitation[0],
      })
    ).toBe(false)
  })
})
