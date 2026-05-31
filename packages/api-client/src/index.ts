export { HttpClient, ApiError } from "./http-client";
export type { ApiClientConfig } from "./http-client";
export { UsersApi } from "./users";

import { HttpClient, type ApiClientConfig } from "./http-client";
import { UsersApi } from "./users";

/** Aggregated API client providing typed access to all backend endpoints. */
export class ApiClient {
  public readonly users: UsersApi;
  public readonly http: HttpClient;

  constructor(config: ApiClientConfig) {
    this.http = new HttpClient(config);
    this.users = new UsersApi(this.http);
  }
}

/** Factory function to create an ApiClient instance. */
export function createApiClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}
