import { env } from "@/config/env"
import {
  HttpErrorCode,
  isApiErrorCode,
  type ApiErrorCode,
  type ApiErrorResponse,
  type ApiFieldError,
  type ApiSuccessResponse,
} from "@workspace/contracts"

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
  const { __retried: _retried, ...requestInit } = init
  const headers = new Headers(requestInit.headers)

  if (
    !headers.has("Content-Type") &&
    requestInit.body &&
    !(requestInit.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json")
  }

  const response = await fetch(`${env.apiUrl}${path}`, {
    ...requestInit,
    headers,
    credentials: "include",
  })

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null)

    if (isApiErrorBody(body)) {
      throw new ApiError({
        message: body.message,
        status: body.statusCode,
        code: isApiErrorCode(body.code) ? body.code : HttpErrorCode.HTTP_ERROR,
        errors: body.errors ?? null,
      })
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
