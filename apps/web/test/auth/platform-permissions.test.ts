import { describe, expect, it } from "vitest"
import { checkPlatformPermission } from "@workspace/auth/permissions"

describe("platformUiPermissions", () => {
  it("allows admins to manage platform users", () => {
    expect(
      checkPlatformPermission({
        role: "admin",
        resource: "user",
        action: "list",
      })
    ).toBe(true)
    expect(
      checkPlatformPermission({
        role: "admin",
        resource: "user",
        action: "create",
      })
    ).toBe(true)
    expect(
      checkPlatformPermission({
        role: "admin",
        resource: "user",
        action: "set-role",
      })
    ).toBe(true)
    expect(
      checkPlatformPermission({
        role: "admin",
        resource: "user",
        action: "ban",
      })
    ).toBe(true)
    expect(
      checkPlatformPermission({
        role: "admin",
        resource: "user",
        action: "impersonate",
      })
    ).toBe(true)
  })

  it("hides admin actions from guest users", () => {
    expect(
      checkPlatformPermission({
        role: "guest",
        resource: "user",
        action: "list",
      })
    ).toBe(false)
    expect(
      checkPlatformPermission({
        role: "guest",
        resource: "user",
        action: "ban",
      })
    ).toBe(false)
  })

  it("grants support role read access but prevents destructive actions", () => {
    expect(
      checkPlatformPermission({
        role: "support",
        resource: "project",
        action: "read",
      })
    ).toBe(true)
    expect(
      checkPlatformPermission({
        role: "support",
        resource: "user",
        action: "list",
      })
    ).toBe(false)
    expect(
      checkPlatformPermission({
        role: "support",
        resource: "content",
        action: "read",
      })
    ).toBe(true)
    expect(
      checkPlatformPermission({
        role: "support",
        resource: "project",
        action: "delete",
      })
    ).toBe(false)
  })

  it("denies access when no platform role is present", () => {
    expect(
      checkPlatformPermission({
        role: null,
        resource: "project",
        action: "read",
      })
    ).toBe(false)
    expect(
      checkPlatformPermission({
        role: undefined,
        resource: "project",
        action: "read",
      })
    ).toBe(false)
  })

  it("denies access for unknown platform roles", () => {
    expect(
      checkPlatformPermission({
        role: "superhacker",
        resource: "project",
        action: "read",
      })
    ).toBe(false)
  })
})
