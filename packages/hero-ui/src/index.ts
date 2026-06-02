/**
 * HeroUI v3 React Components + Better Auth UI
 *
 * Re-exports all components from @heroui/react and Better Auth UI
 * This package serves as a wrapper for the monorepo
 */

// Export all HeroUI components and hooks (includes useTheme)
export * from "@heroui/react"

// Export Better Auth UI components (HeroUI variant includes all needed components)
export * from "@better-auth-ui/heroui"

// Export Better Auth UI hooks and queries (but avoid re-exporting AuthProvider)
export {
  // Queries
  useSession,
  useUser,
  useAuthenticate,
  useListAccounts,
  useAccountInfo,
  useListSessions,
  useListDeviceSessions,
  useListPasskeys,
  // Mutations
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
} from "@better-auth-ui/react"

// Export utilities
export { cn } from "./lib/utils"
