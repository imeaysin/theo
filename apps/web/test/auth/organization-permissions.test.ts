import { describe, expect, it } from "vitest"
import { checkOrganizationPermission } from "@workspace/auth/permissions/organization"
import { organizationUiPermissions } from "../../../../packages/ui/src/auth/organization/ui-permissions"

type UiPermissionResource =
  keyof (typeof organizationUiPermissions)["inviteMember"]["permissions"]

describe("organizationUiPermissions", () => {
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
        checkOrganizationPermission(
          "owner",
          resource as UiPermissionResource,
          permissionAction as never
        ),
        `${action} should be allowed for owners`
      ).toBe(true)
    }
  })

  it("hides destructive and invite actions from members", () => {
    expect(
      checkOrganizationPermission(
        "member",
        "organization",
        organizationUiPermissions.deleteOrganization.permissions.organization[0]
      )
    ).toBe(false)
    expect(
      checkOrganizationPermission(
        "member",
        "invitation",
        organizationUiPermissions.inviteMember.permissions.invitation[0]
      )
    ).toBe(false)
  })
})
