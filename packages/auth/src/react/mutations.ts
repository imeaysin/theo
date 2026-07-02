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
import {
  clearStoredAuthJwt,
  DEFAULT_JWT_STORAGE_KEY,
  refreshAuthToken,
} from "./utils/auth-token"
import {
  isOrganizationSlugTakenError,
  type OrganizationSlugAvailability,
} from "../lib/organization-slug-availability"
import { unwrapClientResult } from "./utils/client-call"

export type SignUpMutationInput = SignUpInput & {
  callbackURL: string
}

export type ForgotPasswordMutationInput = ForgotPasswordInput & {
  redirectTo: string
}

export type SendVerificationEmailInput = {
  email: string
  callbackURL: string
}

export type SocialSignInInput = {
  provider: "google" | "github"
  callbackURL: string
}

export type SignOutOptions = {
  jwtStorageKey?: string
}

export type ChangeEmailInput = {
  newEmail: string
  callbackURL: string
}

export type UpdateUserInput = {
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
  { jwtStorageKey = DEFAULT_JWT_STORAGE_KEY }: SignOutOptions = {}
) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async () => {
      const { error } = await client.signOut()
      if (error) throw error
      clearStoredAuthJwt(jwtStorageKey)
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
    mutationFn: async (input: TwoFactorInput) => {
      const result = await unwrapClientResult(
        client.twoFactor.verifyTotp({
          code: input.code,
          trustDevice: true,
        })
      )
      await refreshAuthToken(client)
      return result
    },
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

export function useCreateOrganization(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: {
      name: string
      slug: string
      logo?: string
    }) => {
      const organization = await unwrapClientResult(
        client.organization.create(input)
      )

      if (organization?.id) {
        await unwrapClientResult(
          client.organization.setActive({ organizationId: organization.id })
        )
        await refreshAuthToken(client)
      }

      return organization
    },
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
    mutationFn: async (input: { organizationId: string }) => {
      const result = await unwrapClientResult(client.organization.delete(input))
      await refreshAuthToken(client)
      return result
    },
    onSuccess: () => invalidate(),
  })
}

export function useSetActiveOrganization(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: { organizationId: string | null }) => {
      const result = await unwrapClientResult(
        client.organization.setActive(input)
      )
      await refreshAuthToken(client)
      return result
    },
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
    mutationFn: async (input: {
      memberId: string
      organizationId?: string
    }) => {
      const result = await unwrapClientResult(
        client.organization.removeMember({
          memberIdOrEmail: input.memberId,
          ...(input.organizationId
            ? { organizationId: input.organizationId }
            : {}),
        })
      )
      await refreshAuthToken(client)
      return result
    },
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
    }) => {
      const result = await unwrapClientResult(
        client.organization.updateMemberRole({
          memberId: input.memberId,
          role: input.role,
          ...(input.organizationId
            ? { organizationId: input.organizationId }
            : {}),
        })
      )
      await refreshAuthToken(client)
      return result
    },
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

      const result = await unwrapClientResult(
        client.organization.leave({ organizationId })
      )
      await refreshAuthToken(client)
      return result
    },
    onSuccess: () => invalidate(),
  })
}

export function useAcceptInvitation(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()
  return useMutation({
    mutationFn: async (input: { invitationId: string }) => {
      const invitation = await unwrapClientResult(
        client.organization.acceptInvitation(input)
      )

      const organizationId =
        invitation &&
        typeof invitation === "object" &&
        "organizationId" in invitation &&
        typeof invitation.organizationId === "string"
          ? invitation.organizationId
          : null

      if (organizationId) {
        await unwrapClientResult(
          client.organization.setActive({ organizationId })
        )
      }

      await refreshAuthToken(client)
      return invitation
    },
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
    mutationFn: async (input: {
      slug: string
    }): Promise<OrganizationSlugAvailability> => {
      try {
        const result = await unwrapClientResult(
          client.organization.checkSlug(input)
        )
        return { available: result?.status === true }
      } catch (error) {
        if (isOrganizationSlugTakenError(error)) {
          return { available: false }
        }
        throw error
      }
    },
  })
}

export function useCreateOrganizationRole(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()

  return useMutation({
    mutationFn: async (
      input: Parameters<AuthClient["organization"]["createRole"]>[0]
    ) => unwrapClientResult(client.organization.createRole(input)),
    onSuccess: () => invalidate(),
  })
}

export function useUpdateOrganizationRole(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()

  return useMutation({
    mutationFn: async (
      input: Parameters<AuthClient["organization"]["updateRole"]>[0]
    ) => unwrapClientResult(client.organization.updateRole(input)),
    onSuccess: () => invalidate(),
  })
}

export function useDeleteOrganizationRole(client: AuthClient = authClient) {
  const invalidate = useInvalidateAuthQueries()

  return useMutation({
    mutationFn: async (
      input: Parameters<AuthClient["organization"]["deleteRole"]>[0]
    ) => unwrapClientResult(client.organization.deleteRole(input)),
    onSuccess: () => invalidate(),
  })
}
