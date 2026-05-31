import { HttpClient } from "./http-client";
import type {
  UserResponse,
  UpdateUserRoleInput,
  BanUserInput,
  UpdateProfileInput,
} from "@repo/contracts";

/** Typed SDK for user-related API endpoints. */
export class UsersApi {
  constructor(private readonly http: HttpClient) {}

  /** Get the currently authenticated user's profile. */
  getMe(): Promise<UserResponse> {
    return this.http.get<UserResponse>("/users/me");
  }

  /** Update the currently authenticated user's profile. */
  updateMe(data: UpdateProfileInput): Promise<UserResponse> {
    return this.http.patch<UserResponse>("/users/me", data);
  }

  /** List all users (admin only). */
  listAll(): Promise<UserResponse[]> {
    return this.http.get<UserResponse[]>("/users");
  }

  /** Get a specific user by ID. */
  getById(id: string): Promise<UserResponse> {
    return this.http.get<UserResponse>(`/users/${id}`);
  }

  /** Update a user's role (admin only). */
  updateRole(id: string, data: UpdateUserRoleInput): Promise<UserResponse> {
    return this.http.patch<UserResponse>(`/users/${id}/role`, data);
  }

  /** Ban or unban a user (admin only). */
  ban(id: string, data: BanUserInput): Promise<UserResponse> {
    return this.http.patch<UserResponse>(`/users/${id}/ban`, data);
  }
}
