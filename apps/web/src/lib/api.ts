import { authClient } from "@workspace/auth/client"
import { DEFAULT_JWT_STORAGE_KEY, getBearerToken } from "@workspace/auth/react"
import { env } from "@/config/env"
import {
  HttpErrorCode,
  isApiErrorCode,
  type ApiErrorCode,
  type ApiErrorResponse,
  type ApiFieldError,
  type ApiSuccessResponse,
} from "@workspace/contracts"

const RETRYABLE_AUTH_STATUSES = new Set([401, 403])

type InternalFetchInit = RequestInit & { __retried?: boolean }

export type ApiErrorOptions = {
  message: string
  status: number
  code: ApiErrorCode
  errors?: ApiFieldError[] | null
}

export class ApiError extends Error {
  readonly status: number
  readonly code: ApiErrorCode
  readonly errors: ApiFieldError[] | null

  constructor({ message, status, code, errors = null }: ApiErrorOptions) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.code = code
    this.errors = errors
  }
}

function isApiErrorBody(value: unknown): value is ApiErrorResponse {
  if (typeof value !== "object" || value === null) return false

  return (
    "success" in value &&
    value.success === false &&
    "statusCode" in value &&
    typeof value.statusCode === "number" &&
    "code" in value &&
    typeof value.code === "string" &&
    "message" in value &&
    typeof value.message === "string"
  )
}

function isSuccessEnvelope<T>(value: unknown): value is ApiSuccessResponse<T> {
  if (typeof value !== "object" || value === null) return false

  return "success" in value && value.success === true && "data" in value
}

async function executeFetch<T>(
  path: string,
  init?: InternalFetchInit
): Promise<T>
async function executeFetch(
  path: string,
  init?: InternalFetchInit
): Promise<void>
async function executeFetch<T = void>(
  path: string,
  init: InternalFetchInit = {}
): Promise<T | undefined> {
  const { __retried, ...requestInit } = init
  const token = await getBearerToken(authClient, DEFAULT_JWT_STORAGE_KEY)
  const headers = new Headers(requestInit.headers)

  if (
    !headers.has("Content-Type") &&
    requestInit.body &&
    !(requestInit.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json")
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(`${env.apiUrl}${path}`, {
    ...requestInit,
    headers,
  })

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null)

    if (isApiErrorBody(body)) {
      const apiError = new ApiError({
        message: body.message,
        status: body.statusCode,
        code: isApiErrorCode(body.code) ? body.code : HttpErrorCode.HTTP_ERROR,
        errors: body.errors ?? null,
      })

      if (!__retried && RETRYABLE_AUTH_STATUSES.has(apiError.status) && token) {
        const refreshed = await getBearerToken(
          authClient,
          DEFAULT_JWT_STORAGE_KEY,
          {
            forceRefresh: true,
          }
        )
        if (refreshed && refreshed !== token) {
          return executeFetch<T>(path, { ...requestInit, __retried: true })
        }

        // If refresh failed or returned the same token, sign out and redirect to clear state
        await authClient.signOut()
        window.location.href = "/sign-in"
      }

      throw apiError
    }

    throw new ApiError({
      message: response.statusText,
      status: response.status,
      code: HttpErrorCode.INTERNAL_SERVER_ERROR,
    })
  }

  if (response.status === 204) {
    return undefined
  }

  const json = await response.json()

  if (!isSuccessEnvelope<T>(json)) {
    throw new ApiError({
      message: "Invalid API response",
      status: response.status,
      code: HttpErrorCode.INTERNAL_SERVER_ERROR,
    })
  }

  return json.data
}

export function apiFetch<T>(path: string, init?: RequestInit): Promise<T>
export function apiFetch(path: string, init?: RequestInit): Promise<void>
export function apiFetch<T = void>(
  path: string,
  init?: RequestInit
): Promise<T | undefined> {
  return executeFetch<T>(path, init)
}
