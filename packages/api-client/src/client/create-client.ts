import { resolveApiBaseUrl } from "@src/lib/config"
import type { ApiClientConfig } from "@src/http/types"
import { ApiClient } from "@src/client/api-client"

export function createApiClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config)
}

/** Web-friendly factory using `VITE_API_URL` / `NEXT_PUBLIC_API_URL` when set. */
export function createDefaultApiClient(
  config: Partial<ApiClientConfig> = {},
): ApiClient {
  return createApiClient({
    baseUrl: resolveApiBaseUrl(config.baseUrl),
    ...config,
  })
}
