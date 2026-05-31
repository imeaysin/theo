import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { authClient } from "@/lib/auth"
import { getAuthErrorMessage } from "@/lib/auth-error"
import { paths } from "@/config/paths"
import { useAuthUiStore } from "@/features/auth/stores/auth-ui-store"
import type { TwoFactorInput } from "@repo/contracts"

export function useVerifyTwoFactor() {
  const navigate = useNavigate()
  const clearTwoFactorMethods = useAuthUiStore((s) => s.clearTwoFactorMethods)

  return useMutation({
    mutationFn: async (input: TwoFactorInput) => {
      const result = await authClient.twoFactor.verifyTotp({
        code: input.code,
      })

      if (result.error) {
        throw new Error(getAuthErrorMessage(result.error))
      }

      return result.data
    },
    onSuccess: () => {
      clearTwoFactorMethods()
      navigate(paths.dashboard, { replace: true })
    },
  })
}
