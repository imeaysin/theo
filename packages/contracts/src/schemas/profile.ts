import { z } from "zod"

export const UpdateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
})

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>

export const ChangeEmailSchema = z.object({
  newEmail: z.email("Enter a valid email address"),
})

export type ChangeEmailInput = z.infer<typeof ChangeEmailSchema>
