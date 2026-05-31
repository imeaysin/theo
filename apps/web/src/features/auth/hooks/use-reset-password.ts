import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { authClient } from "@/lib/auth"
import { getAuthErrorMessage } from "@/lib/auth-error"
import { paths } from "@/config/paths"
import type { ResetPasswordInput } from "@repo/contracts"

export function useResetPassword(token: string | null) {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (input: ResetPasswordInput) => {
      if (!token) {
        throw new Error("Reset link is invalid or expired.")
      }

      const result = await authClient.resetPassword({
        newPassword: input.password,
        token,
      })

      if (result.error) {
        throw new Error(getAuthErrorMessage(result.error))
      }

      return result.data
    },
    onSuccess: () => {
      navigate(paths.auth.signIn, { replace: true })
    },
  })
}
