import {
  useSignInEmail,
  useSignUpEmail,
  useSignOut,
  useRequestPasswordReset,
  useResetPassword,
  useUpdateUser,
  useChangeEmail,
  useChangePassword,
  useDeleteUser,
  useLinkSocial,
  useUnlinkAccount,
  useRevokeSession,
} from "@workspace/hero-ui/better-auth-ui"
import { authClient } from "@/lib/auth"

/**
 * Auth Mutations Hooks
 *
 * Pre-configured mutation hooks that wrap better-auth-ui mutations
 * with the app's authClient, so components don't need to import it.
 */

/**
 * Sign in with email and password
 */
export function useAuthSignIn() {
  return useSignInEmail(authClient)
}

/**
 * Sign up with email and password
 */
export function useAuthSignUp() {
  return useSignUpEmail(authClient)
}

/**
 * Sign out current session
 */
export function useAuthSignOut() {
  return useSignOut(authClient)
}

/**
 * Request password reset email
 */
export function useAuthRequestPasswordReset() {
  return useRequestPasswordReset(authClient)
}

/**
 * Reset password with token
 */
export function useAuthResetPassword() {
  return useResetPassword(authClient)
}

/**
 * Update user profile (name, image, etc.)
 */
export function useAuthUpdateUser() {
  return useUpdateUser(authClient)
}

/**
 * Change email address
 */
export function useAuthChangeEmail() {
  return useChangeEmail(authClient)
}

/**
 * Change password
 */
export function useAuthChangePassword() {
  return useChangePassword(authClient)
}

/**
 * Delete user account
 */
export function useAuthDeleteUser() {
  return useDeleteUser(authClient)
}

/**
 * Link social provider to account
 */
export function useAuthLinkSocial() {
  return useLinkSocial(authClient)
}

/**
 * Unlink social provider from account
 */
export function useAuthUnlinkAccount() {
  return useUnlinkAccount(authClient)
}

/**
 * Revoke/sign out another session
 */
export function useAuthRevokeSession() {
  return useRevokeSession(authClient)
}
