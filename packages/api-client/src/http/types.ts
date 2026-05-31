export interface ApiClientConfig {
  /**
   * API origin (e.g. `http://localhost:4000`).
   * The `/api` prefix is appended automatically unless already present.
   */
  baseUrl: string
  /** @default '/api' */
  apiPrefix?: string
  /** Override for React Native, tests, or custom runtimes. @default global fetch */
  fetch?: typeof fetch
  /**
   * Web: `include` sends Better Auth session cookies.
   * Mobile: use `omit` and supply cookies via `getCookieHeader`.
   * @default 'include'
   */
  credentials?: RequestCredentials
  /** Native apps: return the full `Cookie` header value. */
  getCookieHeader?: () => Promise<string | null> | string | null
  /** Optional Bearer token in addition to cookies. */
  getAccessToken?: () => Promise<string | null> | string | null
}

export interface RequestOptions {
  headers?: Record<string, string>
  signal?: AbortSignal
}
