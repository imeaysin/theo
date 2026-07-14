import { describe, expect, it } from "vitest"
import { checkOrganizationPermission } from "@workspace/auth/permissions/organization"
import { organizationUiPermissions } from "../../../../packages/ui/src/auth/organization/ui-permissions"

type UiPermissionResource =
  keyof (typeof organizationUiPermissions)["inviteMember"]["permissions"]

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

  it("maps UI actions to permissions owners are granted", () => {
    for (const [action, check] of Object.entries(organizationUiPermissions)) {
      const [resource, actions] = Object.entries(check.permissions)[0] ?? []
      const permissionAction = actions?.[0]

      expect(resource, `${action} should declare a resource`).toBeTruthy()
      expect(
        permissionAction,
        `${action} should declare an action`
      ).toBeTruthy()

      if (!resource || !permissionAction) continue

      expect(
        checkOrganizationPermission({
          role: "owner",
          resource: resource as UiPermissionResource,
          action: permissionAction as never,
        }),
        `${action} should be allowed for owners`
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
