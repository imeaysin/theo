import { z } from "zod"

export const UserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  image: z.string().nullable(),
  emailVerified: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type UserResponse = z.infer<typeof UserResponseSchema>
