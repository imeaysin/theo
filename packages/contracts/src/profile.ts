import { z } from "zod"

export const UpdateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  image: z.string().url("Invalid image URL").optional(),
})

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>
