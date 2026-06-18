import { MongoClient } from "mongodb"
import { env } from "@workspace/config"
import { auth } from "../server/create-auth"

export interface TestUserOptions {
  email?: string
  name?: string
  password?: string
}

async function fetchAccessToken(bearerToken: string): Promise<string> {
  const response = await auth.api.getToken({
    headers: new Headers({
      Authorization: `Bearer ${bearerToken}`,
    }),
  })

  if (!response?.token) {
    throw new Error("Failed to fetch access token")
  }

  return response.token
}

export async function createTestUser(options: TestUserOptions = {}) {
  const email = options.email ?? `test-${Date.now()}@example.com`
  const name = options.name ?? "Test User"
  const password = options.password ?? "password123!"

  const result = await auth.api.signUpEmail({
    body: {
      email,
      name,
      password,
    },
  })

  if (!result.user) throw new Error("Failed to create test user")

  return result.user
}

export async function createTestAuthContext(options: TestUserOptions = {}) {
  const password = options.password ?? "password123!"
  const user = await createTestUser({ ...options, password })

  const result = await auth.api.signInEmail({
    body: {
      email: user.email,
      password,
    },
  })

  if (!result) throw new Error("Failed to sign in test user")

  const bearerToken = "token" in result ? String(result.token) : null
  if (!bearerToken) throw new Error("Failed to obtain bearer token")

  const accessToken = await fetchAccessToken(bearerToken)

  return {
    user,
    bearerToken,
    accessToken,
    authHeaders: mockAuthHeaders(accessToken),
  }
}

export function mockAuthHeaders(accessToken: string): Record<string, string> {
  return {
    Authorization: `Bearer ${accessToken}`,
  }
}

export async function clearAuthCollections(): Promise<void> {
  const client = new MongoClient(env.MONGODB_URI)

  try {
    const db = client.db()
    await Promise.all([
      db.collection("users").deleteMany({}),
      db.collection("sessions").deleteMany({}),
      db.collection("accounts").deleteMany({}),
      db.collection("verifications").deleteMany({}),
      db.collection("jwks").deleteMany({}),
    ])
  } finally {
    await client.close()
  }
}
