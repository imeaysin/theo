import type { z } from "zod"
import { normalizeApiBaseUrl } from "@src/lib/config"
import { ApiError } from "@src/lib/errors"
import { parseResponse } from "@src/lib/parse-response"
import type { ApiClientConfig, RequestOptions } from "@src/http/types"

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE"

/**
 * HTTP layer for the REST API (not Better Auth — use `@repo/auth/client` for auth).
 */
export class HttpClient {
  private readonly baseUrl: string
  private readonly fetchFn: typeof fetch
  private readonly credentials: RequestCredentials
  private readonly getCookieHeader: () => Promise<string | null> | string | null
  private readonly getAccessToken: () => Promise<string | null> | string | null

  constructor(config: ApiClientConfig) {
    this.baseUrl = normalizeApiBaseUrl(config.baseUrl, config.apiPrefix)
    this.fetchFn = config.fetch ?? fetch
    this.credentials = config.credentials ?? "include"
    this.getCookieHeader = config.getCookieHeader ?? (() => null)
    this.getAccessToken = config.getAccessToken ?? (() => null)
  }

  get baseURL(): string {
    return this.baseUrl
  }

  async request<T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const url = `${this.baseUrl}${toPath(path)}`
    const headers = await this.buildHeaders(options?.headers)

    const response = await this.fetchFn(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: options?.signal,
      credentials: this.credentials,
    })

    if (!response.ok) {
      const errorBody = await readJsonSafe(response)
      throw new ApiError(response.status, response.statusText, errorBody)
    }

    if (response.status === 204) return undefined as T

    return readJsonSafe(response) as Promise<T>
  }

  async get<T>(
    path: string,
    schema: z.ZodType<T>,
    options?: RequestOptions
  ): Promise<T> {
    const data = await this.request<unknown>("GET", path, undefined, options)
    return parseResponse(schema, data, `GET ${path}`)
  }

  async patch<T>(
    path: string,
    schema: z.ZodType<T>,
    body: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const data = await this.request<unknown>("PATCH", path, body, options)
    return parseResponse(schema, data, `PATCH ${path}`)
  }

  async post<T>(
    path: string,
    schema: z.ZodType<T>,
    body: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const data = await this.request<unknown>("POST", path, body, options)
    return parseResponse(schema, data, `POST ${path}`)
  }

  private async buildHeaders(
    extra?: Record<string, string>
  ): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...extra,
    }

    const cookie = await this.getCookieHeader()
    if (cookie) headers.Cookie = cookie

    const token = await this.getAccessToken()
    if (token) headers.Authorization = `Bearer ${token}`

    return headers
  }
}

function toPath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`
}

async function readJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}
