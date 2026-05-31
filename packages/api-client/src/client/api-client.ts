import { HttpClient } from "@src/http/http-client"
import type { ApiClientConfig } from "@src/http/types"
import { UsersApi } from "@src/resources/users"

/** Typed REST client for the Nest API. */
export class ApiClient {
  readonly http: HttpClient
  readonly users: UsersApi

  constructor(config: ApiClientConfig) {
    this.http = new HttpClient(config)
    this.users = new UsersApi(this.http)
  }
}
