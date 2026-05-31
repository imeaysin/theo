import { z } from "zod"

export const UserRoleSchema = z.enum(["admin", "user"])

export const UserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: UserRoleSchema,
  image: z.string().nullable(),
  banned: z.boolean(),
  banReason: z.string().nullable(),
  emailVerified: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const UpdateUserRoleSchema = z.object({
  role: UserRoleSchema,
})

export const BanUserSchema = z.object({
  banned: z.boolean(),
  reason: z.string().min(1).optional(),
})

export const SessionSchema = z.object({
  id: z.string(),
  token: z.string(),
  expiresAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
})

export const AuthResponseSchema = z.object({
  user: UserResponseSchema,
  session: SessionSchema.optional(),
  token: z.string().optional(),
})

export type UserRole = z.infer<typeof UserRoleSchema>
export type UserResponse = z.infer<typeof UserResponseSchema>
export type UpdateUserRoleInput = z.infer<typeof UpdateUserRoleSchema>
export type BanUserInput = z.infer<typeof BanUserSchema>
export type SessionResponse = z.infer<typeof SessionSchema>
export type AuthResponse = z.infer<typeof AuthResponseSchema>
