/** HTTP method types supported by the client. */
type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

/** Configuration for creating an API client instance. */
export interface ApiClientConfig {
  baseUrl: string;
  getToken?: () => Promise<string | null> | string | null;
}

/** Structured error returned by the API client on non-2xx responses. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: unknown,
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = "ApiError";
  }
}

/** Options for individual requests. */
interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

/**
 * Core HTTP client that wraps `fetch` with auth header injection,
 * JSON serialization, and structured error handling.
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly getToken: () => Promise<string | null> | string | null;

  constructor(config: ApiClientConfig) {
    // Strip trailing slash for consistent URL construction
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.getToken = config.getToken ?? (() => null);
  }

  async request<T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const token = await this.getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options?.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: options?.signal,
      credentials: "include",
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new ApiError(response.status, response.statusText, errorBody);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("GET", path, undefined, options);
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>("POST", path, body, options);
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>("PATCH", path, body, options);
  }

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>("PUT", path, body, options);
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("DELETE", path, undefined, options);
  }
}
