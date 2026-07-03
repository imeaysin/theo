import {
  countOrganizationPermissions,
  isReservedOrganizationRoleName,
  type OrganizationPermissionMap,
} from "../permissions/organization"
import { platformRoleNames } from "../permissions/platform"
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

export const workspaceOnboardingSchema = createOrganizationSchema.pick({
  name: true,
})

export const updateOrganizationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  slug: organizationSlugSchema,
})

export const inviteMemberSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  role: z.string().min(1, "Role is required"),
})

export const createAdminUserSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  name: z.string().trim().min(1, "Name is required").max(100),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(platformRoleNames),
})

export const banUserSchema = z.object({
  banReason: z.string().trim().max(500),
})

export const userNameSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
})

export const changeEmailSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
})

export const organizationRoleNameSchema = z
  .string()
  .trim()
  .transform((value) => value.toLowerCase().replace(/\s+/g, "-"))
  .pipe(
    z
      .string()
      .min(1, "Role name is required")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use lowercase letters, numbers, and hyphens"
      )
  )

const organizationPermissionMapSchema = z.custom<OrganizationPermissionMap>(
  (value) => typeof value === "object" && value !== null
)

export const createOrganizationRoleSchema = z.object({
  role: organizationRoleNameSchema.refine(
    (name) => !isReservedOrganizationRoleName(name),
    "This role name is reserved"
  ),
  permission: organizationPermissionMapSchema.refine(
    (permissions) => countOrganizationPermissions(permissions) > 0,
    "Select at least one permission"
  ),
})

export const editOrganizationRoleSchema = z.object({
  permission: organizationPermissionMapSchema.refine(
    (permissions) => countOrganizationPermissions(permissions) > 0,
    "Select at least one permission"
  ),
})

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>
export type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>
export type BanUserInput = z.infer<typeof banUserSchema>
export type UserNameInput = z.infer<typeof userNameSchema>
export type ChangeEmailInput = z.infer<typeof changeEmailSchema>
export type CreateOrganizationRoleInput = z.infer<
  typeof createOrganizationRoleSchema
>
export type EditOrganizationRoleInput = z.infer<
  typeof editOrganizationRoleSchema
>
