import type {
  InferInvitation,
  InferMember,
  InferOrganization,
} from "better-auth/plugins/organization"
import type { organizationPluginOptions } from "../config/organization-plugin"

type OrganizationPluginConfig = typeof organizationPluginOptions

export type Organization = InferOrganization<OrganizationPluginConfig>
export type OrganizationMember = InferMember<OrganizationPluginConfig>
export type OrganizationInvitation = InferInvitation<OrganizationPluginConfig>

export type ActiveOrganization = Organization & {
  members: OrganizationMember[]
  invitations: OrganizationInvitation[]
}

export type OrganizationSummary = Partial<
  Pick<Organization, "id" | "name" | "slug" | "logo">
>
