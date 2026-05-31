import { useMutation } from "@tanstack/react-query"
import { useNavigate, useLocation } from "react-router-dom"
import { signIn } from "@/lib/auth"
import { getAuthErrorMessage } from "@/lib/auth-error"
import { paths } from "@/config/paths"
import type { SignInInput } from "@repo/contracts"

export function useSignIn() {
  const navigate = useNavigate()
  const location = useLocation()

  return useMutation({
    mutationFn: async (input: SignInInput) => {
      const result = await signIn.email({
        email: input.email,
        password: input.password,
      })

      if (result.error) {
        throw new Error(getAuthErrorMessage(result.error))
      }

      return result.data
    },
    onSuccess: () => {
      const from =
        (location.state as { from?: string } | null)?.from ?? paths.dashboard
      navigate(from, { replace: true })
    },
  })
}
