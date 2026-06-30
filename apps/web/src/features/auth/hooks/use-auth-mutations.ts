import { useMutation } from "@tanstack/react-query"
import type {
  ForgotPasswordInput,
  ResetPasswordInput,
  SignInInput,
  SignUpInput,
  TwoFactorInput,
} from "@workspace/contracts"
import { authClient } from "@/lib/auth"
import { absoluteAppUrl, paths } from "@/config/paths"

export function useSignInMutation() {
  return useMutation({
    mutationFn: async (input: SignInInput) => {
      const { data, error } = await authClient.signIn.email(input)
      if (error) throw error
      return data
    },
  })
}

export function useSignUpMutation() {
  return useMutation({
    mutationFn: async (input: SignUpInput) => {
      const { data, error } = await authClient.signUp.email({
        email: input.email,
        password: input.password,
        name: input.name,
        callbackURL: absoluteAppUrl(paths.auth.verifyEmail),
      })
      if (error) throw error
      return data
    },
  })
}

export function useSignOutMutation() {
  return useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signOut()
      if (error) throw error
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.removeItem("__ba_jwt")
      }
    },
  })
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: async (input: ForgotPasswordInput) => {
      const { data, error } = await authClient.requestPasswordReset({
        email: input.email,
        redirectTo: absoluteAppUrl(paths.auth.resetPassword),
      })
      if (error) throw error
      return data
    },
  })
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: async ({
      input,
      token,
    }: {
      input: ResetPasswordInput
      token: string
    }) => {
      const { data, error } = await authClient.resetPassword({
        newPassword: input.password,
        token,
      })
      if (error) throw error
      return data
    },
  })
}

export function useVerifyTotpMutation() {
  return useMutation({
    mutationFn: async (input: TwoFactorInput) => {
      const { data, error } = await authClient.twoFactor.verifyTotp({
        code: input.code,
        trustDevice: true,
      })
      if (error) throw error
      return data
    },
  })
}

export function useSendVerificationEmailMutation() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: absoluteAppUrl(paths.auth.verifyEmail),
      })
      if (error) throw error
      return data
    },
  })
}

export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: async (token: string) => {
      const { data, error } = await authClient.verifyEmail({ query: { token } })
      if (error) throw error
      return data
    },
  })
}

export function useSocialSignInMutation() {
  return useMutation({
    mutationFn: async (provider: "google" | "github") => {
      const { data, error } = await authClient.signIn.social({
        provider,
        callbackURL: absoluteAppUrl(paths.dashboard),
      })
      if (error) throw error
      return data
    },
  })
}
