export { AuthUiConfigProvider, useAuthUiConfig } from "./auth-ui-config"
export type {
  AuthLinkComponent,
  AuthLinkProps,
  AuthNavigateOptions,
  AuthRoutes,
  AuthUiConfig,
  AuthUiConfigProviderProps,
} from "./auth-ui-config"
export {
  useAccountInfo,
  useActiveMember,
  useActiveOrganization,
  useActiveOrganizationId,
  useAssignableOrganizationRoles,
  useAuthenticate,
  useAuthSession,
  useFullOrganization,
  useListAccounts,
  useListOrganizationInvitations,
  useListOrganizationMembers,
  useListOrganizationRoles,
  useListOrganizations,
  useListPasskeys,
  useListSessions,
  useListUserInvitations,
  useOrganizationPermission,
  useUser,
} from "./queries"
export type {
  CreateOrganizationRoleInput,
  DeleteOrganizationRoleInput,
  OrganizationRole,
  UpdateOrganizationRoleInput,
} from "../types/organization"
export {
  useAcceptInvitation,
  useAddPasskey,
  useCancelInvitation,
  useChangeEmail,
  useChangePassword,
  useCheckSlug,
  useCreateOrganization,
  useCreateOrganizationRole,
  useDeleteOrganization,
  useDeleteOrganizationRole,
  useDeletePasskey,
  useDeleteUser,
  useInviteMember,
  useLeaveOrganization,
  useLinkSocial,
  useRejectInvitation,
  useRemoveMember,
  useRequestPasswordReset,
  useResetPassword,
  useRevokeSession,
  useSendVerificationEmail,
  useSetActiveOrganization,
  useSignInEmail,
  useSignInMagicLink,
  useSignInPasskey,
  useSignInSocial,
  useSignOut,
  useSignUpEmail,
  useUnlinkAccount,
  useUpdateMemberRole,
  useUpdateOrganization,
  useUpdateOrganizationRole,
  useUpdateUser,
  useVerifyEmail,
  useVerifyTotp,
} from "./mutations"
export type {
  ChangeEmailInput,
  ForgotPasswordMutationInput,
  SendVerificationEmailInput,
  SignOutOptions,
  SignUpMutationInput,
  SocialSignInInput,
  UpdateUserInput,
} from "./mutations"
export { authQueryKeys } from "./query-keys"
export {
  buildOrganizationSlug,
  buildOrganizationSlugBase,
  buildOrganizationSlugCandidates,
  buildUniqueOrganizationSlugSuffix,
  resolveAvailableOrganizationSlug,
  sanitizeOrganizationSlug,
} from "../lib/organization-slug"
export {
  isOrganizationSlugAvailable,
  isOrganizationSlugTakenError,
} from "../lib/organization-slug-availability"
export type { OrganizationSlugAvailability } from "../lib/organization-slug-availability"
export { DEFAULT_JWT_STORAGE_KEY } from "../lib/constants"
export {
  clearStoredAuthJwt,
  getBearerToken,
  refreshAuthToken,
} from "./utils/auth-token"
export { isJwtExpired } from "./utils/jwt-expiry"
export { checkOrganizationSlugAvailable } from "./utils/organization-slug"
export { getEmailProviderLink } from "./utils/email-provider"
export type { EmailProviderLink } from "./utils/email-provider"
