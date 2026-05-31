export { ApiClient } from "@src/client/api-client"
export { createApiClient, createDefaultApiClient } from "@src/client/create-client"
export {
  normalizeApiBaseUrl,
  resolveApiBaseUrl,
  trimTrailingSlashes,
} from "@src/lib/config"
export { ApiError, ApiErrorBodySchema, type ApiErrorBody } from "@src/lib/errors"
export { HttpClient } from "@src/http/http-client"
export type { ApiClientConfig, RequestOptions } from "@src/http/types"
export { UsersApi } from "@src/resources/users"
export type {
  BanUserInput,
  UpdateProfileInput,
  UpdateUserRoleInput,
  UserResponse,
} from "@src/resources/users"
