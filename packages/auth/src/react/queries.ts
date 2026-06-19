/**
 * Auth Query Hooks
 *
 * TanStack Query primitives for every Better Auth read endpoint.
 * Re-exported from @better-auth-ui/react.
 *
 * Usage: pass your app's authClient as the first argument.
 */

// Auth
export { useSession, useUser, useAuthenticate } from "@better-auth-ui/react"

// Settings
export {
  useListAccounts,
  useAccountInfo,
  useListSessions,
  useListDeviceSessions,
  useListPasskeys,
  useListApiKeys,
} from "@better-auth-ui/react"

// Organization
export {
  useActiveOrganization,
  useFullOrganization,
  useListOrganizations,
  useListOrganizationMembers,
  useListOrganizationInvitations,
  useListUserInvitations,
  useHasPermission,
} from "@better-auth-ui/react"
