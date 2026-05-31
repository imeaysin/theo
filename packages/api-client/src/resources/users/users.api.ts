import {
  BanUserSchema,
  UpdateProfileSchema,
  UpdateUserRoleSchema,
  UserResponseSchema,
  type BanUserInput,
  type UpdateProfileInput,
  type UpdateUserRoleInput,
  type UserResponse,
} from "@repo/contracts"
import type { HttpClient } from "@src/http/http-client"
import type { RequestOptions } from "@src/http/types"

const UserListSchema = UserResponseSchema.array()

/** Users API (`/api/users/*`). Requires an authenticated session. */
export class UsersApi {
  constructor(private readonly http: HttpClient) {}

  getMe(options?: RequestOptions): Promise<UserResponse> {
    return this.http.get("/users/me", UserResponseSchema, options)
  }

  updateMe(data: UpdateProfileInput, options?: RequestOptions): Promise<UserResponse> {
    const body = UpdateProfileSchema.parse(data)
    return this.http.patch("/users/me", UserResponseSchema, body, options)
  }

  listAll(options?: RequestOptions): Promise<UserResponse[]> {
    return this.http.get("/users", UserListSchema, options)
  }

  getById(id: string, options?: RequestOptions): Promise<UserResponse> {
    return this.http.get(`/users/${id}`, UserResponseSchema, options)
  }

  updateRole(
    id: string,
    data: UpdateUserRoleInput,
    options?: RequestOptions,
  ): Promise<UserResponse> {
    const body = UpdateUserRoleSchema.parse(data)
    return this.http.patch(`/users/${id}/role`, UserResponseSchema, body, options)
  }

  ban(id: string, data: BanUserInput, options?: RequestOptions): Promise<UserResponse> {
    const body = BanUserSchema.parse(data)
    return this.http.patch(`/users/${id}/ban`, UserResponseSchema, body, options)
  }
}

export type { UserResponse, UpdateProfileInput, UpdateUserRoleInput, BanUserInput }
