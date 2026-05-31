import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { signUp } from "@/lib/auth"
import { getAuthErrorMessage } from "@/lib/auth-error"
import { paths } from "@/config/paths"
import type { SignUpInput } from "@repo/contracts"

export function useSignUp() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (input: SignUpInput) => {
      const result = await signUp.email({
        name: input.name,
        email: input.email,
        password: input.password,
      })

      if (result.error) {
        throw new Error(getAuthErrorMessage(result.error))
      }

      return result.data
    },
    onSuccess: () => {
      navigate(paths.auth.verifyEmail, { replace: true })
    },
  })
}
