"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import type {
  ForgotPasswordInput,
  ResetPasswordInput,
  SignInInput,
  SignUpInput,
  TwoFactorInput,
} from "@workspace/contracts"
import { authClient, type AuthClient } from "../lib/auth-client"
import { authQueryKeys } from "./query-keys"
import { unwrapClientResult } from "./utils/client-call"

export type SignUpMutationInput = SignUpInput & {
  callbackURL: string
}

export type ForgotPasswordMutationInput = ForgotPasswordInput & {
  redirectTo: string
}

export interface SendVerificationEmailInput {
  email: string
  callbackURL: string
}

export interface SocialSignInInput {
  provider: "google" | "github"
  callbackURL: string
}

export interface SignOutOptions {
  jwtStorageKey?: string
}

export interface ChangeEmailInput {
  newEmail: string
  callbackURL: string
}

export interface UpdateUserInput {
  name?: string
  image?: string | null
  [key: string]: unknown
}

function useInvalidateAuthQueries() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: authQueryKeys.all })
}

export function useSignInEmail(client: AuthClient = authClient) {
  return useMutation({
    mutationFn: async (input: SignInInput) =>
      unwrapClientResult(client.signIn.email(input)),
  })
}

export function useSignInUsername(client: AuthClient = authClient) {
  return useMutation({
    mutationFn: async (input: { username: string; password: string }) => {
      const signInUsername = (
        client.signIn as AuthClient["signIn"] & {
          username?: (input: {
            username: string
            password: string
          }) => ReturnType<AuthClient["signIn"]["email"]>
        }
      ).username
      if (!signInUsername) {
        throw new Error("Username sign-in is not enabled")
      }
      return unwrapClientResult(signInUsername(input))
    },
  })
}

export function useSignInMagicLink(client: AuthClient = authClient) {
  return useMutation({
    mutationFn: async (input: { email: string; callbackURL: string }) =>
      unwrapClientResult(
        client.signIn.magicLink({
          email: input.email,
          callbackURL: input.callbackURL,
        })
      ),
  })
}

export function useSignInPasskey(client: AuthClient = authClient) {
  return useMutation({
    mutationFn: async () => {
      const signInPasskey = client.signIn.passkey
      if (!signInPasskey) {
        throw new Error("Passkey sign-in is not enabled")
      }
      return unwrapClientResult(signInPasskey())
    },
  })
}

export function useSignInSocial(client: AuthClient = authClient) {
  return useMutation({
    mutationFn: async ({ provider, callbackURL }: SocialSignInInput) =>
      unwrapClientResult(
        client.signIn.social({
          provider,
          callbackURL,
        })
      ),
  })
}

export function useSignUpEmail(client: AuthClient = authClient) {
  return useMutation({
    mutationFn: async ({
      callbackURL,
      confirmPassword: _confirmPassword,
      ...input
    }: SignUpMutationInput) =>
      unwrapClientResult(
        client.signUp.email({
          email: input.email,
          password: input.password,
          name: input.name,
          callbackURL,
        })
      ),
  })
}

export function useSignOut(
  client: AuthClient = authClient,
  { jwtStorageKey = "__ba_jwt" }: SignOutOptions = {}
) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async () => {
      const { error } = await client.signOut()
      if (error) throw error
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.removeItem(jwtStorageKey)
      }
    },
    onSuccess: () => invalidate(),
  })
}

export function useRequestPasswordReset(client: AuthClient = authClient) {
  return useMutation({
    mutationFn: async ({ email, redirectTo }: ForgotPasswordMutationInput) =>
      unwrapClientResult(
        client.requestPasswordReset({
          email,
          redirectTo,
        })
      ),
  })
}

export function useResetPassword(client: AuthClient = authClient) {
  return useMutation({
    mutationFn: async ({
      input,
      token,
    }: {
      input: ResetPasswordInput
      token: string
    }) =>
      unwrapClientResult(
        client.resetPassword({
          newPassword: input.password,
          token,
        })
      ),
  })
}

export function useSendVerificationEmail(client: AuthClient = authClient) {
  return useMutation({
    mutationFn: async ({ email, callbackURL }: SendVerificationEmailInput) =>
      unwrapClientResult(
        client.sendVerificationEmail({
          email,
          callbackURL,
        })
      ),
  })
}

export function useVerifyEmail(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (token: string) =>
      unwrapClientResult(client.verifyEmail({ query: { token } })),
    onSuccess: () => invalidate(),
  })
}

export function useVerifyTotp(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: TwoFactorInput) =>
      unwrapClientResult(
        client.twoFactor.verifyTotp({
          code: input.code,
          trustDevice: true,
        })
      ),
    onSuccess: () => invalidate(),
  })
}

export function useUpdateUser(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: UpdateUserInput) =>
      unwrapClientResult(client.updateUser(input)),
    onSuccess: () => invalidate(),
  })
}

export function useChangeEmail(client: AuthClient = authClient) {
  return useMutation({
    mutationFn: async (input: ChangeEmailInput) =>
      unwrapClientResult(
        client.changeEmail({
          newEmail: input.newEmail,
          callbackURL: input.callbackURL,
        })
      ),
  })
}

export function useChangePassword(client: AuthClient = authClient) {
  return useMutation({
    mutationFn: async (input: {
      currentPassword: string
      newPassword: string
      revokeOtherSessions?: boolean
    }) =>
      unwrapClientResult(
        client.changePassword({
          currentPassword: input.currentPassword,
          newPassword: input.newPassword,
          revokeOtherSessions: input.revokeOtherSessions ?? true,
        })
      ),
  })
}

export function useDeleteUser(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input?: { password?: string; callbackURL?: string }) =>
      unwrapClientResult(client.deleteUser(input ?? {})),
    onSuccess: () => invalidate(),
  })
}

export function useLinkSocial(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: { provider: string; callbackURL: string }) =>
      unwrapClientResult(
        client.linkSocial({
          provider: input.provider,
          callbackURL: input.callbackURL,
        })
      ),
    onSuccess: () => invalidate(),
  })
}

export function useUnlinkAccount(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: { providerId: string }) =>
      unwrapClientResult(client.unlinkAccount(input)),
    onSuccess: () => invalidate(),
  })
}

export function useAddPasskey(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input?: { name?: string }) => {
      const addPasskey = client.passkey?.addPasskey
      if (!addPasskey) throw new Error("Passkeys are not enabled")
      return unwrapClientResult(addPasskey.call(client.passkey, input))
    },
    onSuccess: () => invalidate(),
  })
}

export function useDeletePasskey(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: { id: string }) => {
      const deletePasskey = client.passkey?.deletePasskey
      if (!deletePasskey) throw new Error("Passkeys are not enabled")
      return unwrapClientResult(deletePasskey.call(client.passkey, input))
    },
    onSuccess: () => invalidate(),
  })
}

export function useRevokeSession(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: { token: string }) =>
      unwrapClientResult(client.revokeSession(input)),
    onSuccess: () => invalidate(),
  })
}

export function useRevokeMultiSession(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: { sessionToken: string }) => {
      const revokeDeviceSession = (
        client as AuthClient & {
          multiSession?: {
            revoke: (input: {
              sessionToken: string
            }) => ReturnType<AuthClient["revokeSession"]>
          }
        }
      ).multiSession?.revoke
      if (!revokeDeviceSession) {
        throw new Error("Multi-session is not enabled")
      }
      return unwrapClientResult(revokeDeviceSession(input))
    },
    onSuccess: () => invalidate(),
  })
}

export function useSetActiveSession(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: { sessionToken: string }) => {
      const setActive = (
        client as AuthClient & {
          multiSession?: {
            setActive: (input: {
              sessionToken: string
            }) => ReturnType<AuthClient["revokeSession"]>
          }
        }
      ).multiSession?.setActive
      if (!setActive) throw new Error("Multi-session is not enabled")
      return unwrapClientResult(setActive(input))
    },
    onSuccess: () => invalidate(),
  })
}

export function useCreateApiKey(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: { name?: string }) => {
      const create = (
        client as AuthClient & {
          apiKey?: {
            create: (input: {
              name?: string
            }) => ReturnType<AuthClient["revokeSession"]>
          }
        }
      ).apiKey?.create
      if (!create) throw new Error("API keys are not enabled")
      return unwrapClientResult(create(input))
    },
    onSuccess: () => invalidate(),
  })
}

export function useDeleteApiKey(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: { keyId: string }) => {
      const remove = (
        client as AuthClient & {
          apiKey?: {
            delete: (input: {
              keyId: string
            }) => ReturnType<AuthClient["revokeSession"]>
          }
        }
      ).apiKey?.delete
      if (!remove) throw new Error("API keys are not enabled")
      return unwrapClientResult(remove(input))
    },
    onSuccess: () => invalidate(),
  })
}

export function useCreateOrganization(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: { name: string; slug: string; logo?: string }) =>
      unwrapClientResult(client.organization.create(input)),
    onSuccess: () => invalidate(),
  })
}

export function useUpdateOrganization(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: {
      organizationId?: string
      name?: string
      slug?: string
      logo?: string | null
    }) =>
      unwrapClientResult(
        client.organization.update({
          ...(input.organizationId
            ? { organizationId: input.organizationId }
            : {}),
          data: {
            name: input.name,
            slug: input.slug,
            logo: input.logo,
          },
        })
      ),
    onSuccess: () => invalidate(),
  })
}

export function useDeleteOrganization(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: { organizationId: string }) =>
      unwrapClientResult(client.organization.delete(input)),
    onSuccess: () => invalidate(),
  })
}

export function useSetActiveOrganization(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: { organizationId: string | null }) =>
      unwrapClientResult(client.organization.setActive(input)),
    onSuccess: () => invalidate(),
  })
}

export function useInviteMember(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: {
      email: string
      role: string
      organizationId?: string
    }) =>
      unwrapClientResult(
        client.organization.inviteMember({
          email: input.email,
          role: input.role,
          ...(input.organizationId
            ? { organizationId: input.organizationId }
            : {}),
        })
      ),
    onSuccess: () => invalidate(),
  })
}

export function useRemoveMember(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: { memberId: string; organizationId?: string }) =>
      unwrapClientResult(
        client.organization.removeMember({
          memberIdOrEmail: input.memberId,
          ...(input.organizationId
            ? { organizationId: input.organizationId }
            : {}),
        })
      ),
    onSuccess: () => invalidate(),
  })
}

export function useUpdateMemberRole(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: {
      memberId: string
      role: string
      organizationId?: string
    }) =>
      unwrapClientResult(
        client.organization.updateMemberRole({
          memberId: input.memberId,
          role: input.role,
          ...(input.organizationId
            ? { organizationId: input.organizationId }
            : {}),
        })
      ),
    onSuccess: () => invalidate(),
  })
}

export function useLeaveOrganization(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: { organizationId?: string } = {}) => {
      const organizationId =
        input.organizationId ??
        client.useSession.get().data?.session.activeOrganizationId

      if (!organizationId) {
        throw new Error("No active organization")
      }

      return unwrapClientResult(client.organization.leave({ organizationId }))
    },
    onSuccess: () => invalidate(),
  })
}

export function useAcceptInvitation(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: { invitationId: string }) =>
      unwrapClientResult(client.organization.acceptInvitation(input)),
    onSuccess: () => invalidate(),
  })
}

export function useCancelInvitation(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: { invitationId: string }) =>
      unwrapClientResult(client.organization.cancelInvitation(input)),
    onSuccess: () => invalidate(),
  })
}

export function useRejectInvitation(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: { invitationId: string }) =>
      unwrapClientResult(client.organization.rejectInvitation(input)),
    onSuccess: () => invalidate(),
  })
}

export function useCheckSlug(client: AuthClient = authClient) {
  return useMutation({
    mutationFn: async (input: { slug: string }) =>
      unwrapClientResult(client.organization.checkSlug(input)),
  })
}

// Backward-compatible aliases used by the web app
export const useSignInMutation = useSignInEmail
export const useSignUpMutation = useSignUpEmail
export const useSignOutMutation = useSignOut
export const useForgotPasswordMutation = useRequestPasswordReset
export const useResetPasswordMutation = useResetPassword
export const useSocialSignInMutation = useSignInSocial
export const useSendVerificationEmailMutation = useSendVerificationEmail
export const useVerifyEmailMutation = useVerifyEmail
export const useVerifyTotpMutation = useVerifyTotp
