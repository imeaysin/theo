import { authClient } from "@/lib/auth"
import { env } from "@/config/env"

const JWT_STORAGE_KEY = "__ba_jwt"

async function getBearerToken(): Promise<string | null> {
  if (typeof sessionStorage !== "undefined") {
    const cached = sessionStorage.getItem(JWT_STORAGE_KEY)
    if (cached) return cached
  }

  const { data, error } = await authClient.token()
  if (error || !data?.token) return null

  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(JWT_STORAGE_KEY, data.token)
  }

  return data.token
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const token = await getBearerToken()
  const headers = new Headers(init?.headers)

  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json")
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(`${env.apiUrl}${path}`, {
    ...init,
    headers,
    credentials: "include",
  })

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText)
    throw new ApiError(message || response.statusText, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const json = (await response.json()) as T | { data: T }
  if (
    json !== null &&
    typeof json === "object" &&
    "data" in json &&
    Object.keys(json).length === 1
  ) {
    return json.data
  }

  return json as T
}
