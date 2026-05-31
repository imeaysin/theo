import { useMutation } from "@tanstack/react-query"
import { authClient } from "@/lib/auth"
import { getAuthErrorMessage } from "@/lib/auth-error"
import { paths } from "@/config/paths"
import type { ForgotPasswordInput } from "@repo/contracts"

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (input: ForgotPasswordInput) => {
      const result = await authClient.requestPasswordReset({
        email: input.email,
        redirectTo: `${window.location.origin}${paths.auth.resetPassword}`,
      })

      if (result.error) {
        throw new Error(getAuthErrorMessage(result.error))
      }

      return result.data
    },
  })
}
