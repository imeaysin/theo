import { describe, expect, it, beforeAll, vi } from "vitest"
import { createAuthClient } from "better-auth/client"
import { organizationClient } from "better-auth/client/plugins"
import { organizationPluginOptions } from "../src/config/organization-plugin"
import { checkOrganizationPermissionAsync } from "../src/permissions/organization/server"
import { getAuth, type Auth } from "../src/lib/auth"
import { ensureAuthMongoConnected } from "../src/db/mongo"

let interceptedVerificationUrl = ""
vi.mock("@workspace/email", () => ({
  createEmailProvider: () => ({
    sendVerificationEmail: async (_email: string, url: string) => {
      interceptedVerificationUrl = url
    },
    sendResetPasswordEmail: vi.fn(),
    sendMagicLinkEmail: vi.fn(),
    sendOtpEmail: vi.fn(),
    sendOrganizationInvitationEmail: vi.fn(),
  }),
}))

const createTestAuthClient = (customFetchImpl: typeof fetch) =>
  createAuthClient({
    baseURL: "http://localhost/api/auth",
    plugins: [organizationClient(organizationPluginOptions)],
    fetchOptions: { customFetchImpl },
  })

type TestAuthClient = ReturnType<typeof createTestAuthClient>

const ROLE_NAME = "custom-editor"

describe("Dynamic Role API", () => {
  let auth: Auth
  let authClient: TestAuthClient
  let orgId: string
  let currentCookie = ""

  beforeAll(async () => {
    await ensureAuthMongoConnected()
    auth = getAuth()

    authClient = createTestAuthClient(async (url, init) => {
      const req = new Request(url, init)
      if (currentCookie) req.headers.set("cookie", currentCookie)

      const res = await auth.handler(req)

      const setCookie = res.headers.get("set-cookie")
      if (setCookie) {
        const [firstCookie] = setCookie.split(";")
        if (firstCookie) currentCookie = firstCookie
      }
      return res
    })

    const testEmail = `test-api-${Date.now()}@example.com`
    await authClient.signUp.email({
      email: testEmail,
      password: "Password123!",
      name: "API Test User",
    })

    await auth.handler(new Request(interceptedVerificationUrl))

    await authClient.signIn.email({
      email: testEmail,
      password: "Password123!",
    })

    const { data: org, error: orgError } = await authClient.organization.create(
      {
        name: "Edge Case Org",
        slug: `edge-org-${Date.now()}`,
      }
    )

    if (orgError ?? !org?.id) {
      throw new Error("Org creation failed in beforeAll")
    }
    orgId = org.id
  })

  it("creates a custom role and grants its specific actions", async () => {
    const { data: role, error } = await authClient.organization.createRole({
      organizationId: orgId,
      role: ROLE_NAME,
      permission: {
        project: ["read", "update"],
        content: ["read", "create"],
      },
    })

    expect(error).toBeNull()
    expect(role).toHaveProperty("roleData.role", ROLE_NAME)

    const canUpdate = await checkOrganizationPermissionAsync({
      organizationId: orgId,
      role: ROLE_NAME,
      resource: "project",
      action: "update",
    })
    expect(canUpdate).toBe(true)

    const canReadContent = await checkOrganizationPermissionAsync({
      organizationId: orgId,
      role: ROLE_NAME,
      resource: "content",
      action: "read",
    })
    expect(canReadContent).toBe(true)
  })

  it("denies actions not included in the dynamic role grant", async () => {
    const canDelete = await checkOrganizationPermissionAsync({
      organizationId: orgId,
      role: ROLE_NAME,
      resource: "project",
      action: "delete",
    })
    expect(canDelete).toBe(false)

    const canPublish = await checkOrganizationPermissionAsync({
      organizationId: orgId,
      role: ROLE_NAME,
      resource: "content",
      action: "publish",
    })
    expect(canPublish).toBe(false)
  })

  it("returns false for a null or undefined role", async () => {
    const withNull = await checkOrganizationPermissionAsync({
      organizationId: orgId,
      role: null,
      resource: "project",
      action: "read",
    })
    expect(withNull).toBe(false)

    const withUndefined = await checkOrganizationPermissionAsync({
      organizationId: orgId,
      role: undefined,
      resource: "project",
      action: "read",
    })
    expect(withUndefined).toBe(false)
  })

  it("returns false for a role name that was never created", async () => {
    const result = await checkOrganizationPermissionAsync({
      organizationId: orgId,
      role: "ghost-role-that-does-not-exist",
      resource: "project",
      action: "read",
    })
    expect(result).toBe(false)
  })

  it("resolves static built-in roles without a DB lookup", async () => {
    const ownerCanDelete = await checkOrganizationPermissionAsync({
      organizationId: orgId,
      role: "owner",
      resource: "organization",
      action: "delete",
    })
    expect(ownerCanDelete).toBe(true)

    const memberCannotInvite = await checkOrganizationPermissionAsync({
      organizationId: orgId,
      role: "member",
      resource: "invitation",
      action: "create",
    })
    expect(memberCannotInvite).toBe(false)
  })

  it("grants access when a comma-separated list contains one matching role", async () => {
    const result = await checkOrganizationPermissionAsync({
      organizationId: orgId,
      role: "member,owner",
      resource: "organization",
      action: "delete",
    })
    expect(result).toBe(true)
  })

  it("grants access when a comma-separated list contains the dynamic role", async () => {
    const result = await checkOrganizationPermissionAsync({
      organizationId: orgId,
      role: `member,${ROLE_NAME}`,
      resource: "project",
      action: "update",
    })
    expect(result).toBe(true)
  })

  it("returns an error when an unauthenticated client attempts to create a role", async () => {
    const unauthClient = createTestAuthClient(async (url, init) => {
      return auth.handler(new Request(url, init))
    })

    const { error } = await unauthClient.organization.createRole({
      organizationId: orgId,
      role: "unauthorized-role",
      permission: { project: ["read"] },
    })

    expect(error).not.toBeNull()
  })
})
