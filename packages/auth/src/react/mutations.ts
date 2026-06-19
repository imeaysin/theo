/**
 * Auth Mutation Hooks
 *
 * TanStack Query primitives for every Better Auth write endpoint.
 * Re-exported from @better-auth-ui/react.
 *
 * Usage: pass your app's authClient as the first argument.
 */

// Auth
export {
  useSignInEmail,
  useSignInUsername,
  useSignInMagicLink,
  useSignInPasskey,
  useSignInSocial,
  useSignUpEmail,
  useSignOut,
  useRequestPasswordReset,
  useResetPassword,
  useSendVerificationEmail,
  useIsUsernameAvailable,
} from "@better-auth-ui/react"

// Settings
export {
  useUpdateUser,
  useChangeEmail,
  useChangePassword,
  useDeleteUser,
  useLinkSocial,
  useUnlinkAccount,
  useAddPasskey,
  useDeletePasskey,
  useRevokeSession,
  useRevokeMultiSession,
  useSetActiveSession,
  useCreateApiKey,
  useDeleteApiKey,
} from "@better-auth-ui/react"

// Organization
export {
  useCreateOrganization,
  useUpdateOrganization,
  useDeleteOrganization,
  useSetActiveOrganization,
  useInviteMember,
  useRemoveMember,
  useUpdateMemberRole,
  useLeaveOrganization,
  useAcceptInvitation,
  useCancelInvitation,
  useRejectInvitation,
  useCheckSlug,
} from "@better-auth-ui/react"
