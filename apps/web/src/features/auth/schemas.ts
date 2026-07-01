import { z } from "zod"

const organizationSlugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and hyphens"
  )

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  slug: organizationSlugSchema,
})

export const updateOrganizationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  slug: organizationSlugSchema,
})

export const inviteMemberSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  role: z.string().min(1, "Role is required"),
})

export const userNameSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
})

export const changeEmailSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
})

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>
export type UserNameInput = z.infer<typeof userNameSchema>
export type ChangeEmailInput = z.infer<typeof changeEmailSchema>
