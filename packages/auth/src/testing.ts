import { auth } from "./server"
import { UserModel, type IUserDocument } from "@repo/db"

export interface TestUserOverrides extends Partial<IUserDocument> {
  password?: string
}

export async function createTestUser(overrides: TestUserOverrides = {}) {
  const email = overrides.email || `test-${Date.now()}@example.com`
  const name = overrides.name || "Test User"
  const password = overrides.password || "password123!"

  const result = await auth.api.signUpEmail({
    body: {
      email,
      name,
      password,
    },
  })

  if (!result.user) throw new Error("Failed to create test user")

  if (Object.keys(overrides).length > 0 || overrides.emailVerified !== false) {
    const { password: _pw, ...dbOverrides } = overrides
    await UserModel.findByIdAndUpdate(result.user.id, {
      emailVerified: true,
      ...dbOverrides,
    })
  }

  return UserModel.findById(result.user.id).lean()
}

export async function createAdminUser(overrides: TestUserOverrides = {}) {
  return createTestUser({ role: "admin", ...overrides })
}

export async function createTestSession(userOverrides: TestUserOverrides = {}) {
  const password = "password123!"
  const user = await createTestUser({ ...userOverrides, password })

  if (!user) throw new Error("Failed to create test user for session")

  const result = await auth.api.signInEmail({
    body: {
      email: user.email,
      password,
    },
  })

  if (!result) throw new Error("Failed to create test session")

  const token = "token" in result ? String(result.token) : "mock-token"
  const sessionData = "session" in result ? result.session : result

  return {
    user,
    session: sessionData,
    sessionToken: token,
    authHeaders: mockAuthHeaders(token),
  }
}

export function mockAuthHeaders(sessionToken: string): Record<string, string> {
  return {
    Cookie: `codebase-x.session_token=${sessionToken}`,
  }
}

export async function clearAuthCollections() {
  await UserModel.deleteMany({})
}
