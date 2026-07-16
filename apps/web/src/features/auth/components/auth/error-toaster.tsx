import { authMutationKeys, authQueryKeys } from "@better-auth-ui/core"
import {
  matchMutation,
  matchQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"
import { useEffect } from "react"
import { toast } from "sonner"

function handleAuthMutationError(error: unknown) {
  const err = error as BetterFetchError
  if (err.error?.code === "EMAIL_NOT_VERIFIED") return
  toast.error(err.error?.message || err.message)
}

export function ErrorToaster() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const queryCache = queryClient.getQueryCache()
    const previousQueryOnError = queryCache.config.onError

    queryCache.config.onError = (error, query) => {
      previousQueryOnError?.(error, query)

      if (!matchQuery({ queryKey: authQueryKeys.all }, query)) return

      const err = error as BetterFetchError
      if (err?.error?.code === "EMAIL_NOT_VERIFIED") return
      if (err?.error) toast.error(err.error.message)
    }

    const mutationCache = queryClient.getMutationCache()
    const previousMutationOnError = mutationCache.config.onError

    mutationCache.config.onError = (...args) => {
      previousMutationOnError?.(...args)

      const [, , , mutation] = args
      if (!matchMutation({ mutationKey: authMutationKeys.all }, mutation)) {
        return
      }

      handleAuthMutationError(args[0])
    }

    return () => {
      queryCache.config.onError = previousQueryOnError
      mutationCache.config.onError = previousMutationOnError
    }
  }, [queryClient])

  return null
}
